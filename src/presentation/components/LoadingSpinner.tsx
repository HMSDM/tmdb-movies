import React from 'react'
import styled, { keyframes } from 'styled-components'

interface LoadingSpinnerProps {
  size?: number
  color?: string
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`

const Spinner = styled.div<{ size: number; color: string }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 3px solid #333;
  border-top: 3px solid ${props => props.color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingText = styled.p`
  color: #888;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
`

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = '#ffd700'
}) => {
  return (
    <SpinnerContainer>
      <div>
        <Spinner size={size} color={color} />
        <LoadingText>Carregando...</LoadingText>
      </div>
    </SpinnerContainer>
  )
}

