# ChronoCore Resource Monitor

ChronoCore is a real-time system monitoring tool I designed to display GPU, CPU, and RAM usage statistics about my gaming desktop PC on my Raspberry Pi touchscreen during gaming sessions. This project combines Python, React, and TypeScript, utilizing WebSockets for live data transmission.

 <tr>
    <td width="60%"  style="align:center;" valign="top">
            <img src="https://coreydamocles.vercel.app/images/chrono-core.JPG" width="60%"  alt="ChronoCore Resource Monitor"/>
    </td>
  </tr>

## Features

- **Real-Time Monitoring**: Instantly view your GPU, CPU, and RAM statistics in real time.
- **WebSocket Communication**: Leverages WebSockets for seamless, live updates between the desktop and the Raspberry Pi display.
- **Cross-Platform**: Backend written in Python for gathering system stats, with a TypeScript WebSocket server and a React frontend-UI.

## Technology Stack

- **Backend**: Python script utilizing libraries such as [GPUtil](https://github.com/anderskm/gputil) and [psutil](https://github.com/giampaolo/psutil) for monitoring system resources.
- **WebSocket Server**: [TypeScript](https://www.typescriptlang.org/) and [ws](https://github.com/websockets/ws) for handling real-time data transmission.
- **Frontend**: [React](https://react.dev/) and [styled-components](https://styled-components.com/) for displaying the data on a Raspberry Pi.

## Getting Started (WIP, more TBA)

To get ChronoCore up and running on your system, follow these steps:

1. **Set up the Python Environment**: Ensure Python is installed on your desktop, and set up the environment for running the monitoring script. Start the script.

2. **Configure the WebSocket Server**: Install Node.js and the necessary npm packages for the TypeScript WebSocket server. Start the server.

3. **Prepare the Frontend**: Install the React dependencies and build the frontend application.

4. **Deploy on Raspberry Pi or respective device**: Transfer the built React app to your Raspberry Pi or respective device and configure it to display the UI.
