import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Loader from './components/Loader'
import GPUGauge from './components/GPUGauge'
import DataContainer from './components/DataContainer'

const AppContainer = styled.div`
	background-color: var(--bg_color);
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: var(--gap_small);
`

const FlexContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 50px;
	.warning {
		color: var(--warning_color);
	}
`

function App() {
	const [gpuDataReady, setGpuDataReady] = useState(false)
	const [ramDataReady, setRamDataReady] = useState(false)
	const [cpuDataReady, setCpuDataReady] = useState(false)
	const [connected, setConnected] = useState(false)
	const [gpuData, setGpuData] = useState({
		gpuTemp: 0,
		gpuTotalMemory: 0,
		gpuFreeMemory: 0,
		gpuName: ''
	})
	const [ramData, setRamData] = useState({
		ramUtilization: 0,
		ramFree: 0,
		ramTotal: 0,
		ramSpeeds: []
	})
	const [cpuData, setCpuData] = useState({
		totalUsage: 0,
		currentFrequency: 0,
		cpuCores: 0,
		model: ''
	})

	const isDataReady = gpuDataReady && ramDataReady && cpuDataReady

	useEffect(() => {
		const wsHost = import.meta.env.VITE_WS_HOST
		const ws = new WebSocket(wsHost)

		ws.onopen = () => {
			console.log('Connected to WebSocket')
			setConnected(true)
			ws.send(JSON.stringify({ request: 'requestData' }))
		}

		ws.onmessage = event => {
			const data = JSON.parse(event.data)
			console.log('Received data: ', data)

			if (data.gpu) {
				setGpuData({
					gpuTemp: data.gpu.temperature,
					gpuTotalMemory: data.gpu.total_memory,
					gpuFreeMemory: data.gpu.free_memory,
					gpuName: data.gpu.name
				})
				setGpuDataReady(true)
			}

			if (data.ram) {
				setRamData({
					ramUtilization: data.ram.percent,
					ramFree: data.ram.free,
					ramTotal: data.ram.total,
					ramSpeeds: data.ram.speeds
				})
				setRamDataReady(true)
			}

			if (data.cpu) {
				setCpuData({
					totalUsage: data.cpu.total_usage,
					currentFrequency: data.cpu.current_frequency,
					cpuCores: data.cpu.total_cores,
					model: data.cpu.processor_model
				})
				setCpuDataReady(true)
			}
		}

		ws.onclose = () => {
			console.log('Disconnected from WebSocket')
			setConnected(false)
		}

		return () => {
			ws.close()
		}
	}, [])

	const maxGpuTemp = 95
	const gpuTempFraction = gpuData.gpuTemp / maxGpuTemp
	// Custom format function to display temperature in degrees Celsius
	const formatGPUTemperature = () => {
		return `${gpuData.gpuTemp}°C`
	}

	return (
		<AppContainer>
			{connected && !isDataReady ? (
				<>
					<Loader />
				</>
			) : (
				<FlexContainer>
					{connected && (
						<div className="inline_flex">
							<GPUGauge
								gpuData={gpuData}
								gpuTempFraction={gpuTempFraction}
								formatGPUTemperature={formatGPUTemperature}
							/>
							<DataContainer ramData={ramData} cpuData={cpuData} />
						</div>
					)}
					{!connected && <p className="warning">Websocket connection is not established.</p>}
				</FlexContainer>
			)}
		</AppContainer>
	)
}
export default App
