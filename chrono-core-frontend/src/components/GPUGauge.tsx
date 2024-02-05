import GaugeChart from 'react-gauge-chart'
import styled from 'styled-components'

const GPUGaugeStyled = styled.div`
	width: 350px;
	color: #4cc9f0;
	text-align: center;

	p {
		color: #ff4aff;
	}
`

interface GPUGaugeProps {
	gpuData: {
		gpuName: string
		gpuTemp: number
		gpuTotalMemory: number
		gpuFreeMemory: number
	}
	gpuTempFraction: number
	formatGPUTemperature: () => string
}

const GPUGauge: React.FC<GPUGaugeProps> = ({ gpuData, gpuTempFraction, formatGPUTemperature }) => {
	const chartStyle = {
		width: '100%',
		height: 'auto'
	}

	return (
		<GPUGaugeStyled>
			<h3>{gpuData.gpuName ? gpuData.gpuName : 'GPU'}</h3>
			<GaugeChart
				nrOfLevels={20}
				animate={false}
				colors={['#4361EE', '#F72585']}
				textColor="#4cc9f0"
				needleColor="#3a0ca3"
				needleBaseColor="#3a0ca3"
				arcWidth={0.3}
				percent={gpuTempFraction}
				formatTextValue={formatGPUTemperature}
				style={chartStyle}
			/>
			<div className="inline_flex">
				<p>{gpuData.gpuFreeMemory.toFixed(1)} GB Free</p>
				<p>{gpuData.gpuTotalMemory.toFixed(1)} GB Total</p>
			</div>
		</GPUGaugeStyled>
	)
}

export default GPUGauge
