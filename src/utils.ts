import {
  ChildProcess,
  ChildProcessWithoutNullStreams,
  exec,
  spawn,
} from "child_process";
import { promisify } from "util";
import terminate from "terminate";
import isDev from 'electron-is-dev';
import path from 'path';


const spawnAsync = promisify(spawn)

export function startServer(): ChildProcess {
  // Replace "python" with the path to your Python executable if necessary
  // and "app/main.py" with the path to your FastAPI application
  const serverPath = isDev ? '"app/dist/main/main.exe"' : `${path.join(process.resourcesPath, "app/dist/main/main.exe")}`

  const serverProcess = spawn(serverPath, { shell: true });

  serverProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  serverProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
  console.log(serverProcess.pid);
  return serverProcess;
}

export function stopServer(fastAPIProcess: ChildProcess) {
    terminate(fastAPIProcess.pid)
  }

const execAsync = promisify(exec);

export const killProcessesOnPort = async (port: number): Promise<void> => {
  console.log(`Killing processes on ${process.platform}`);
  if (process.platform == "win32") {
    try {
      const findCommand = `netstat -aon | findstr :${port}`;
      const { stdout } = await execAsync(findCommand);

      const lines = stdout.trim().split("\n");
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        const killCommand = `taskkill /F /PID ${pid}`;
        await execAsync(killCommand);
        console.log(`Killed process with PID ${pid} on port ${port}.`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error finding or killing process: ${error.message}`);
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  } else {
    try {
      const command = `lsof -i tcp:${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`;
      await execAsync(command);
      console.log(`Killed processes on port ${port}.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  }
};
