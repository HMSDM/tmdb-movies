import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeft, Star, Calendar, Clock, DollarSign } from "lucide-react";
import { useMovieDetailsViewModel } from "../viewmodels/MovieDetailsViewModel";
import { useGetMovieDetailsUseCase } from "../../infrastructure/di/container";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { getBackdropUrl, getPosterUrl } from "../../shared/utils/imageUtils";
import {
  formatDate,
  formatRuntime,
  formatCurrency,
  formatRating,
  formatVoteCount,
  translateStatus,
  translateLanguage,
  formatMovieBudget,
  calculateProfit,
} from "../../shared/utils/formatUtils";
import { Header, HeaderContent } from "./MovieSearchPage";
import {
  RatingCircle,
  RatingPercentage,
  RatingText,
} from "../components/MovieCard";
import { Movie } from "@/domain/entities/Movie";

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

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  font-size: 14px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffd700;
  font-size: 18px;
  font-weight: 600;
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

const ProductionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 32px;
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

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getMovieDetailsUseCase = useGetMovieDetailsUseCase();

  const { state, actions } = useMovieDetailsViewModel(getMovieDetailsUseCase);

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

  if (state.loading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (state.error) {
    return (
      <PageContainer>
        <ErrorMessage>{state.error}</ErrorMessage>
      </PageContainer>
    );
  }

  if (!state.movie) {
    return (
      <PageContainer>
        <ErrorMessage>Filme não encontrado</ErrorMessage>
      </PageContainer>
    );
  }

  const movie = state.movie;
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
          <section
            style={{
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              gap: "16px",
              justifyContent: "space-between",
              maxHeight: window.innerWidth < 768 ? "100%" : "120px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Title>{movie.title}</Title>
                <OriginalTitle>
                  Título original: {movie.original_title}
                </OriginalTitle>
              </div>
              {movie.tagline && <Tagline>{movie.tagline}</Tagline>}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InfoSection>
                <InfoTitle>Popularidade</InfoTitle>
                <InfoItem>{movie.popularity}</InfoItem>
              </InfoSection>
              <InfoSection>
                <InfoTitle>Votos</InfoTitle>
                <InfoItem>{movie.vote_count}</InfoItem>
              </InfoSection>
              <RatingCircle opacity={1} position="relative">
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
                  <RatingPercentage
                    style={{ color: getFillColor(ratingPercentage) }}
                  >
                    {formatRatingPercentage(movie.vote_average)}
                  </RatingPercentage>
                  <span>%</span>
                </RatingText>
              </RatingCircle>
            </div>
          </section>
          <section
            style={{
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              gap: "16px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
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
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{ display: "flex", flexDirection: "row", gap: "16px" }}
              >
                <InfoSection>
                  <InfoTitle>Lançamento</InfoTitle>
                  <InfoItem>{formatDate(movie.release_date)}</InfoItem>
                </InfoSection>
                <InfoSection>
                  <InfoTitle>Duração</InfoTitle>
                  <InfoItem>{formatRuntime(movie.runtime)}</InfoItem>
                </InfoSection>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "16px" }}
              >
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
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "16px" }}
              >
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
              </div>
            </div>
          </section>
        </MovieDetails>
      </MovieInfo>
    </PageContainer>
  );
};
