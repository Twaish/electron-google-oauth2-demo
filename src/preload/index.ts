import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

type Listener = (...args: any[]) => any
type ListenerMap = Record<string, Listener[]>
type GlobalListeners = Record<string, ListenerMap>

// Custom APIs for renderer
const globalListeners: GlobalListeners = {}
const globalEventHandlers = {
  on: (event: string, id: string, callback: Listener) => {
    // Switch if callback undefined
    if (!callback) {
      // @ts-ignore
      callback = id
      id = '_'
    }

    globalListeners[event] ??= {}
    globalListeners[event][id] ??= []
    globalListeners[event][id].push(callback)

    const events = ipcRenderer.eventNames()
    if (events.includes(event)) return

    ipcRenderer.on(event, (_, ...args) => {
      Object.values(globalListeners[event]).forEach((entry) => {
        entry.forEach((listener) => listener(...args))
      })
    })
  },
  off: (event: string, id: string = '_') => {
    delete globalListeners[event][id]
  },
}

const api = {
  run: (...args) => ipcRenderer.invoke("run", ...args), 
  ...globalEventHandlers
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore 
  window.electron = electronAPI
  // @ts-ignore 
  window.api = api
}
