import styled from "styled-components";
import { Movie } from "../../domain/entities/Movie";
import { getPosterUrl } from "../../shared/utils/imageUtils";
import { formatYear, formatRating } from "../../shared/utils/formatUtils";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const CardContainer = styled.div`
  background: #1a1a1a;
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

const CardContent = styled.div`
  padding: 16px;
`;

const Title = styled.h3`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const Year = styled.span`
  color: #888;
  font-size: 14px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffd700;
  font-size: 14px;
  font-weight: 500;
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

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const handleClick = () => {
    onClick(movie);
  };

  return (
    <CardContainer onClick={handleClick}>
      {movie.poster_path ? (
        <PosterImage
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <PlaceholderPoster>Sem imagem</PlaceholderPoster>
      )}

      <CardContent>
        <Title>{movie.title}</Title>

        <MetaInfo>
          <Year>{formatYear(movie.release_date)}</Year>
          <Rating>
            <Star size={16} fill="currentColor" />
            {formatRating(movie.vote_average)}
          </Rating>
        </MetaInfo>
      </CardContent>
    </CardContainer>
  );
};
