import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  100% {
    transform: rotate(1turn);
  }
`

const Loader = styled.div`
	width: 50px;
	aspect-ratio: 1;
	display: grid;
	animation: ${rotate} 4s infinite;

	&::before,
	&::after {
		content: '';
		grid-area: 1/1;
		border: 8px solid;
		border-radius: 50%;
		border-color: #f72585 #f72585 transparent transparent;
		mix-blend-mode: darken;
		animation: ${rotate} 1s infinite linear;
	}

	&::after {
		border-color: transparent transparent #4cc9f0 #4cc9f0;
		animation-direction: reverse;
	}
`

export default Loader
