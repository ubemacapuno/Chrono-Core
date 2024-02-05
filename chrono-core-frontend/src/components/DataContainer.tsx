import styled from 'styled-components'
import ProgressBar from './ProgressBar'

const DataContainerStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	text-align: center;

	h3 {
		color: #4cc9f0;
	}

	p {
		color: #ff4aff;
	}
`

interface DataContainerProps {
	ramData: { ramUtilization: number; ramTotal: number; ramFree: number; ramSpeeds: number[] }
	cpuData: { totalUsage: number; currentFrequency: number; cpuCores: number; model: string }
}

const DataContainer: React.FC<DataContainerProps> = ({ ramData, cpuData }) => {
	return (
		<DataContainerStyled>
			<h3>{cpuData.model ? cpuData.model : 'CPU'}</h3>
			<ProgressBar value={cpuData.totalUsage} />
			<div className="inline_flex">
				<p>{cpuData.currentFrequency} MHz</p>
				<p>{cpuData.cpuCores} Cores</p>
			</div>

			<h3>RAM</h3>
			<ProgressBar value={ramData.ramUtilization} />
			<div className="inline_flex">
				<p>{ramData.ramFree.toFixed(1)} GB Free</p>
				<p>{ramData.ramTotal.toFixed(1)} GB Total</p>
			</div>
			<div className="inline_flex">
				{ramData.ramSpeeds.map((speed, index) => (
					<p key={index}>
						{speed} MHz({index + 1})
					</p>
				))}
			</div>
		</DataContainerStyled>
	)
}

export default DataContainer
