import {promisify} from 'util'
import {exec} from 'child_process'
import {RIOT_GAMES_CERT} from "@/utils/render/RIOT"

const runCommand = promisify(exec)

const execCmd = async (command, powershell) => {
  try {
    let option = {
      shell: powershell ? `powershell.exe` : `cmd.exe`,
    }
    const {stderr, stdout} = await runCommand(command, option)
    if (stderr) {
      return Promise.reject(stderr)
    }
    return stdout
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getAuthFromCmd = async () => {
  try {
    const cmdLine = await execCmd(
      `wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline /value`,
      false,
    )
    const port = Number(cmdLine.split('--app-port=')[1].split('"')[0])
    const pid = Number(cmdLine.split('--app-pid=')[1].split('"')[0])
    const password = cmdLine.split('--remoting-auth-token=')[1].split('"')[0]
    return {
      port,
      pid,
      password,
      RIOT_GAMES_CERT
    }
  } catch (err) {
    console.error(`[cmd] `, 'League of Legends progress not start')
    return {'port': ''}
  }
}

export const startClientExe = (exe) => {
  execCmd(
    `start "" "${exe}"`,
    false,
  )
}

export const deleteWegame = async (isAutoDeleteWGProcess) => {
  if (!isAutoDeleteWGProcess){return}
  try {
    var wegameProcess = await execCmd(
      `wmic process where name='wegame.exe' get ProcessId`,
      false,
    )
  }catch (e){
    wegameProcess = 'disprocess'
  }

  if (wegameProcess.indexOf('ProcessId') !== -1 ){
    execCmd(
      `wmic process where name='wegame.exe' delete`,
      false,
    )
  }
}
