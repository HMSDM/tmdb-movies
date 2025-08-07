import styled, { css } from "styled-components";
import { Movie, Genre } from "../../domain/entities/Movie";
import { getPosterUrl } from "../../shared/utils/imageUtils";

interface MovieCardProps {
  movie: Movie;
  genres: Genre[];
  onClick: (movie: Movie) => void;
}

const CardContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const PosterImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  background: #2a2a2a;
`;

const PlaceholderPoster = styled.div`
  width: 100%;
  height: 300px;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
`;

const TitleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 16px;
  transition: transform 0.3s ease;
  margin-bottom: -10px;
`;

const Title = styled.h3`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Subtitle = styled.p`
  color: #cccccc;
  font-size: 14px;
  margin: 4px 0 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

export const RatingCircle = styled.div<{
  opacity?: number;
  position?: string;
  width?: string;
  height?: string;
}>`
  position: ${(props) => props.position || "absolute"};
  top: ${(props) => (props.position === "relative" ? "autop" : "40%")};
  left: ${(props) => (props.position === "relative" ? "auto" : "50%")};
  transform: ${(props) =>
    props.position === "relative" ? "none" : "translate(-50%, -50%)"};
  width: ${(props) => props.width || "140px"};
  height: ${(props) => props.height || "140px"};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => props.opacity || 0};

  transition: opacity 0.3s ease;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

export const RatingText = styled.span`
  position: absolute;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  z-index: 1;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
`;

export const RatingPercentage = styled.span`
  font-size: 24px;
`;

const HoverContainer = styled.div`
  &:hover {
    ${TitleContainer} {
      transform: translateY(-8px);
    }
    ${Subtitle} {
      opacity: 1;
    }
    ${RatingCircle} {
      opacity: 1;
    }
  }
`;

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  genres,
  onClick,
}) => {
  const handleClick = () => {
    onClick(movie);
  };

  const genreName =
    movie.genre_ids && movie.genre_ids.length > 0
      ? movie.genre_ids
          .map(
            (id) =>
              genres.find((genre) => genre.id === id)?.name || "Desconhecido"
          )
          .filter(Boolean)
          .join(", ")
      : "Desconhecido";

  const ratingPercentage = movie.vote_average * 10;

  const formatRatingPercentage = (rating: number): string => {
    return `${Math.round(rating * 10)}`;
  };

  const getFillColor = (percentage: number) => {
    if (percentage <= 50) return "#ff4444";
    if (percentage <= 75) return "#ffd700";
    return "#00cc00";
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (ratingPercentage / 100) * circumference
  } ${circumference}`;

  return (
    <CardContainer onClick={handleClick}>
      <HoverContainer>
        {movie.poster_path ? (
          <PosterImage
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <PlaceholderPoster>Sem imagem</PlaceholderPoster>
        )}

        <TitleContainer>
          <Title>{movie.title}</Title>
          <Subtitle>{genreName}</Subtitle>
        </TitleContainer>

        <RatingCircle>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="#00000080"
              stroke={getFillColor(ratingPercentage)}
              strokeWidth="10"
              stroke-width="9"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#444444"
              strokeWidth="10"
              strokeDasharray={`${
                circumference - (ratingPercentage / 100) * circumference
              } ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 70 70)"
            />
          </svg>
          <RatingText>
            <RatingPercentage style={{ color: getFillColor(ratingPercentage) }}>
              {formatRatingPercentage(movie.vote_average)}
            </RatingPercentage>
            <span>%</span>
          </RatingText>
        </RatingCircle>
      </HoverContainer>
    </CardContainer>
  );
};
