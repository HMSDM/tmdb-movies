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
} from "../../shared/utils/formatUtils";

const PageContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
`;

const BackdropContainer = styled.div<{ backdropUrl?: string }>`
  position: relative;
  height: 60vh;
  background: ${(props) =>
    props.backdropUrl
      ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${props.backdropUrl})`
      : "#1a1a1a"};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
`;

const BackButton = styled.button`
  position: absolute;
  top: 24px;
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
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const MovieInfo = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 32px;
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
  font-size: 18px;
  font-weight: 400;
  color: #888;
  margin: 8px 0 0 0;
  font-style: italic;
`;

const Tagline = styled.p`
  font-size: 18px;
  color: #ffd700;
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
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 12px;
  color: #fff;
`;

const Overview = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #ccc;
  margin: 0;
`;

const ProductionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const InfoSection = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
`;

const InfoTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #ffd700;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  font-size: 14px;
  color: #ccc;
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

  return (
    <PageContainer>
      <BackdropContainer backdropUrl={getBackdropUrl(movie.backdrop_path)}>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={16} />
          Voltar
        </BackButton>
      </BackdropContainer>

      <MovieInfo>
        <PosterImage src={getPosterUrl(movie.poster_path)} alt={movie.title} />

        <MovieDetails>
          <div>
            <Title>{movie.title}</Title>
            {movie.original_title !== movie.title && (
              <OriginalTitle>{movie.original_title}</OriginalTitle>
            )}
            {movie.tagline && <Tagline>"{movie.tagline}"</Tagline>}
          </div>

          <MetaInfo>
            <Rating>
              <Star size={20} fill="currentColor" />
              {formatRating(movie.vote_average)}
              <span style={{ color: "#888", fontSize: "14px" }}>
                ({formatVoteCount(movie.vote_count)} votos)
              </span>
            </Rating>

            <MetaItem>
              <Calendar size={16} />
              {formatDate(movie.release_date)}
            </MetaItem>

            {movie.runtime && (
              <MetaItem>
                <Clock size={16} />
                {formatRuntime(movie.runtime)}
              </MetaItem>
            )}
          </MetaInfo>

          {movie.genres.length > 0 && (
            <GenresList>
              {movie.genres.map((genre) => (
                <GenreTag key={genre.id}>{genre.name}</GenreTag>
              ))}
            </GenresList>
          )}

          {movie.overview && <Overview>{movie.overview}</Overview>}

          <ProductionInfo>
            {movie.budget > 0 && (
              <InfoSection>
                <InfoTitle>Orçamento</InfoTitle>
                <InfoItem>{formatCurrency(movie.budget)}</InfoItem>
              </InfoSection>
            )}

            {movie.revenue > 0 && (
              <InfoSection>
                <InfoTitle>Receita</InfoTitle>
                <InfoItem>{formatCurrency(movie.revenue)}</InfoItem>
              </InfoSection>
            )}

            {movie.production_companies.length > 0 && (
              <InfoSection>
                <InfoTitle>Produtoras</InfoTitle>
                <InfoList>
                  {movie.production_companies.slice(0, 5).map((company) => (
                    <InfoItem key={company.id}>{company.name}</InfoItem>
                  ))}
                </InfoList>
              </InfoSection>
            )}

            {movie.production_countries.length > 0 && (
              <InfoSection>
                <InfoTitle>Países</InfoTitle>
                <InfoList>
                  {movie.production_countries.map((country) => (
                    <InfoItem key={country.iso_3166_1}>{country.name}</InfoItem>
                  ))}
                </InfoList>
              </InfoSection>
            )}

            {movie.spoken_languages.length > 0 && (
              <InfoSection>
                <InfoTitle>Idiomas</InfoTitle>
                <InfoList>
                  {movie.spoken_languages.map((language) => (
                    <InfoItem key={language.iso_639_1}>
                      {language.name}
                    </InfoItem>
                  ))}
                </InfoList>
              </InfoSection>
            )}

            <InfoSection>
              <InfoTitle>Informações</InfoTitle>
              <InfoList>
                <InfoItem>Status: {movie.status}</InfoItem>
                <InfoItem>
                  Idioma original: {movie.original_language.toUpperCase()}
                </InfoItem>
                {movie.imdb_id && (
                  <InfoItem>
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#ffd700", textDecoration: "none" }}
                    >
                      Ver no IMDb
                    </a>
                  </InfoItem>
                )}
              </InfoList>
            </InfoSection>
          </ProductionInfo>
        </MovieDetails>
      </MovieInfo>
    </PageContainer>
  );
};
