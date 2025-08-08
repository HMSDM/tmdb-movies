import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useGetMovieDetailsUseCase } from "../../infrastructure/di/container";
import {
  calculateProfit,
  formatDate,
  formatMovieBudget,
  formatRuntime,
  translateLanguage,
  translateStatus,
} from "../../shared/utils/formatUtils";
import { getBackdropUrl, getPosterUrl } from "../../shared/utils/imageUtils";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  RatingCircle,
  RatingPercentage,
  RatingText,
} from "../components/MovieCard";
import { useMovieDetailsViewModel } from "../viewmodels/MovieDetailsViewModel";
import { Header, HeaderContent } from "./MovieSearchPage";

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
`;

const BackdropContainer = styled.div<{ backdropUrl?: string }>`
  display: flex;
  position: relative;
  display: flex;
  align-items: flex-end;
`;

const BackButton = styled.button`
  position: fixed;
  bottom: 24px;
  left: 24px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const MovieInfo = styled.div<{ backdropUrl?: string }>`
  max-width: 1442px;
  background: ${(props) =>
    props.backdropUrl
      ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${props.backdropUrl})`
      : "#1a1a1a"};
  background-size: cover;
  margin: 0 auto;
  padding: 32px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const PosterImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const MovieDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const OriginalTitle = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: #b5b2bc;
  margin: 8px 0 19px 0;
`;

const Tagline = styled.p`
  font-size: 16px;
  color: #eeeef0;
  font-style: italic;
  margin: 0;
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GenreTag = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c150ff2e;
  border-radius: 2px;
  height: 31px;
  padding: 4px 12px;
  font-size: 12px;
  color: #fff;
`;

const WrapperTitle = styled.section`
  display: flex;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.6;
  color: #b5b2bc;
  margin: 0;
`;

const Overview = styled.p`
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
  color: #eeeef0;
  margin: 0;
`;

const InfoSection = styled.div<{ width?: string }>`
  display: flex;
  width: ${(props) => props.width || "100%"};
  flex-direction: column;
  max-height: fit-content;
  background: rgba(35, 34, 37, 0.6);
  border-radius: 4px;
  padding: 16px;
  gap: 8px;
`;

const InfoTitle = styled.h3`
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
  color: #b5b2bc;
`;

const InfoItem = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #eeeef0;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ErrorMessage = styled.div`
  background: #2a1a1a;
  border: 1px solid #ff4444;
  border-radius: 8px;
  padding: 24px;
  margin: 24px;
  color: #ff6666;
  text-align: center;
`;

const MovieSection = styled.section`
  display: flex;
  flex-direction: ${() => (window.innerWidth < 768 ? "column" : "row")};
  gap: 16px;
  justify-content: space-between;
  max-height: ${() => (window.innerWidth < 768 ? "100%" : "120px")};
`;

const MovieInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: center;
  align-items: center;
`;

const MovieContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const PercentageSymbol = styled.span`
  color: #ffffff;
`;

const ResponsiveSVG = styled.svg`
  width: 140px;
  height: 140px;

  @media (max-width: 768px) {
    width: 25vw;
    height: auto;
  }
`;

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getMovieDetailsUseCase = useGetMovieDetailsUseCase();

  const { movieInfo, actions } = useMovieDetailsViewModel(
    getMovieDetailsUseCase
  );

  const formatRatingPercentage = (rating: number): string => {
    return `${Math.round(rating * 10)}`;
  };

  const getFillColor = (percentage: number) => {
    if (percentage <= 50) return "#ff4444";
    if (percentage <= 75) return "#ffd700";
    return "#00cc00";
  };

  useEffect(() => {
    if (id) {
      actions.loadMovieDetails(parseInt(id));
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (movieInfo.loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (movieInfo.error) {
    return (
      <PageContainer>
        <ErrorMessage>{movieInfo.error}</ErrorMessage>
      </PageContainer>
    );
  }

  if (!movieInfo.movie) {
    return (
      <PageContainer>
        <ErrorMessage>Filme não encontrado</ErrorMessage>
      </PageContainer>
    );
  }

  const movie = movieInfo.movie;
  const ratingPercentage = movie.vote_average * 10;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <PageContainer>
      <BackdropContainer backdropUrl={getBackdropUrl(movie.backdrop_path)}>
        <Header>
          <HeaderContent>
            <img src="../../../src/assets/Cubos-Movies-Title.svg" alt="" />
          </HeaderContent>
        </Header>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={16} />
          Voltar
        </BackButton>
      </BackdropContainer>
      <MovieInfo backdropUrl={getBackdropUrl(movie.backdrop_path)}>
        <PosterImage src={getPosterUrl(movie.poster_path)} alt={movie.title} />

        <MovieDetails>
          <MovieSection>
            <MovieInfoWrapper>
              <div>
                <Title>{movie.title}</Title>
                <OriginalTitle>
                  Título original: {movie.original_title}
                </OriginalTitle>
              </div>
              {movie.tagline && <Tagline>{movie.tagline}</Tagline>}
            </MovieInfoWrapper>
            <RatingContainer>
              <InfoSection>
                <InfoTitle>Popularidade</InfoTitle>
                <InfoItem>{movie.popularity}</InfoItem>
              </InfoSection>
              <InfoSection>
                <InfoTitle>Votos</InfoTitle>
                <InfoItem>{movie.vote_count}</InfoItem>
              </InfoSection>
              <RatingCircle
                width="98px"
                height="98px"
                opacity={1}
                position="relative"
              >
                <ResponsiveSVG viewBox="0 0 140 140">
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
                </ResponsiveSVG>
                <RatingText>
                  <RatingPercentage
                    style={{ color: getFillColor(ratingPercentage) }}
                  >
                    {formatRatingPercentage(movie.vote_average)}
                  </RatingPercentage>
                  <PercentageSymbol>%</PercentageSymbol>
                </RatingText>
              </RatingCircle>
            </RatingContainer>
          </MovieSection>
          <MovieSection>
            <MovieContent>
              <InfoSection>
                <WrapperTitle>SINOPSE</WrapperTitle>
                {movie.overview && <Overview>{movie.overview}</Overview>}
              </InfoSection>
              <InfoSection>
                <WrapperTitle>Gêneros</WrapperTitle>
                {movie.genres.length > 0 && (
                  <GenresList>
                    {movie.genres.map((genre) => (
                      <GenreTag key={genre.id}>{genre.name}</GenreTag>
                    ))}
                  </GenresList>
                )}
              </InfoSection>
            </MovieContent>
            <MovieContent>
              <InfoRow>
                <InfoSection>
                  <InfoTitle>Lançamento</InfoTitle>
                  <InfoItem>{formatDate(movie.release_date)}</InfoItem>
                </InfoSection>
                <InfoSection>
                  <InfoTitle>Duração</InfoTitle>
                  <InfoItem>{formatRuntime(movie.runtime)}</InfoItem>
                </InfoSection>
              </InfoRow>
              <InfoRow>
                <InfoSection>
                  <InfoTitle>Situação</InfoTitle>
                  <InfoItem>{translateStatus(movie.status)}</InfoItem>
                </InfoSection>
                <InfoSection>
                  <InfoTitle>Idioma</InfoTitle>
                  <InfoItem>
                    {translateLanguage(movie.original_language)}
                  </InfoItem>
                </InfoSection>
              </InfoRow>
              <InfoRow>
                <InfoSection>
                  <InfoTitle>Orçamento</InfoTitle>
                  <InfoItem>
                    {movie.budget ? formatMovieBudget(movie.budget) : "N/A"}
                  </InfoItem>
                </InfoSection>
                <InfoSection>
                  <InfoTitle>Receita</InfoTitle>
                  <InfoItem>
                    {movie.revenue ? formatMovieBudget(movie.revenue) : "N/A"}
                  </InfoItem>
                </InfoSection>
                <InfoSection>
                  <InfoTitle>Lucro</InfoTitle>
                  <InfoItem>
                    {movie.revenue
                      ? calculateProfit(movie.revenue, movie.budget)
                      : "N/A"}
                  </InfoItem>
                </InfoSection>
              </InfoRow>
            </MovieContent>
          </MovieSection>
        </MovieDetails>
      </MovieInfo>
    </PageContainer>
  );
};
