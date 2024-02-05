import React from 'react'
import styled from 'styled-components'

const ProgressContainer = styled.div`
	background-color: var(--sheet_color);
	border-radius: var(--border_radius);
	margin: var(--gap_smallest) 0;
	position: relative;
	width: 100%;
	overflow: hidden;
`

const Progress = styled.div`
	background: linear-gradient(90deg, #4361ee 0%, #f72585 100%);
	width: 100%;
	height: 1.2rem;
	border-radius: var(--border_radius);
	transition: width 0.4s ease;
`

const ProgressText = styled.div`
	position: absolute;
	width: 100%;
	text-align: center;
	color: var(--text_color);
	z-index: 10;
	top: 0;
	line-height: 1.2rem;

	span {
		font-size: var(--font_small);
	}
`

interface ProgressBarProps {
	value: number // Value is in percentage
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
	return (
		<ProgressContainer>
			<Progress style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }} />
			<ProgressText>
				<span>{value.toFixed(1)}% Utilization</span>
			</ProgressText>
		</ProgressContainer>
	)
}

export default ProgressBar
