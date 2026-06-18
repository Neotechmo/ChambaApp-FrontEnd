import { datadogRum } from '@datadog/browser-rum'

let initialized = false

const datadogConfig = {
  applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID,
  clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN,
  site: import.meta.env.VITE_DATADOG_SITE,
  service: import.meta.env.VITE_DATADOG_SERVICE || 'chambaapp-frontend',
  env: import.meta.env.VITE_DATADOG_ENV || import.meta.env.MODE,
}

export function initDatadogRum() {
  if (initialized) return true

  const hasRequiredConfig = Boolean(
    datadogConfig.applicationId &&
      datadogConfig.clientToken &&
      datadogConfig.site,
  )

  if (!hasRequiredConfig) {
    if (import.meta.env.PROD) {
      console.warn('Datadog RUM no se inició: faltan variables VITE_DATADOG_*')
    }
    return false
  }

  datadogRum.init({
    applicationId: datadogConfig.applicationId,
    clientToken: datadogConfig.clientToken,
    site: datadogConfig.site,
    service: datadogConfig.service,
    env: datadogConfig.env,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    trackViewsManually: false,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input',
  })

  datadogRum.startSessionReplayRecording()
  initialized = true
  return true
}

export function isDatadogReady() {
  return initialized
}

export function setDatadogUser(user) {
  if (!initialized || !user?.id) return

  datadogRum.setUser({
    id: String(user.id),
    role: user.rol,
  })
}

export function clearDatadogUser() {
  if (!initialized) return
  datadogRum.clearUser()
}

export { datadogRum }
