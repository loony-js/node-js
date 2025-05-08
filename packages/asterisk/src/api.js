import axios from "axios"

export default class AriAPI {
  constructor({ baseUrl, username, password }) {
    this.client = axios.create({
      baseURL: `${baseUrl.replace(/\/$/, "")}/ari`,
      auth: { username, password },
    })
  }

  // ------------- Channels ----------------
  channels = {
    list: () => this.client.get("/channels"),
    originate: (data) => this.client.post("/channels", data),
    get: (channelId) => this.client.get(`/channels/${channelId}`),
    hangup: (channelId) => this.client.delete(`/channels/${channelId}`),
    answer: (channelId) => this.client.post(`/channels/${channelId}/answer`),
    continue: (channelId, context, extension, priority, label) =>
      this.client.post(`/channels/${channelId}/continue`, {
        context,
        extension,
        priority,
        label,
      }),
    ring: (channelId) => this.client.post(`/channels/${channelId}/ring`),
    stopRing: (channelId) => this.client.delete(`/channels/${channelId}/ring`),
    mute: (channelId, direction = "both") =>
      this.client.post(`/channels/${channelId}/mute`, { direction }),
    unmute: (channelId, direction = "both") =>
      this.client.delete(`/channels/${channelId}/mute`, { direction }),
    hold: (channelId) => this.client.post(`/channels/${channelId}/hold`),
    unhold: (channelId) => this.client.delete(`/channels/${channelId}/hold`),
    snoop: (channelId, data) =>
      this.client.post(`/channels/${channelId}/snoop`, data),
    sendDTMF: (channelId, data) =>
      this.client.post(`/channels/${channelId}/sendDTMF`, data),
    record: (channelId, data) =>
      this.client.post(`/channels/${channelId}/record`, data),
    stopRecord: (channelId, recordingName) =>
      this.client.delete(`/channels/${channelId}/record/${recordingName}`),
    dial: (channelId) => this.client.post(`/channels/${channelId}/dial`),
    play: (channelId, data) =>
      this.client.post(`/channels/${channelId}/play`, data),
    playLang: (channelId, lang, data) =>
      this.client.post(`/channels/${channelId}/play/${lang}`, data),
    stopPlayback: (channelId, playbackId) =>
      this.client.delete(`/channels/${channelId}/play/${playbackId}`),
    redirect: (channelId, data) =>
      this.client.post(`/channels/${channelId}/redirect`, data),
    move: (channelId, app) =>
      this.client.post(`/channels/${channelId}/move`, { app }),
    getVar: (channelId, variable) =>
      this.client.get(`/channels/${channelId}/variable`, {
        params: { variable },
      }),
    setVar: (channelId, data) =>
      this.client.post(`/channels/${channelId}/variable`, data),
  }

  // ------------- Bridges ----------------
  bridges = {
    list: () => this.client.get("/bridges"),
    create: (data) => this.client.post("/bridges", data),
    get: (bridgeId) => this.client.get(`/bridges/${bridgeId}`),
    destroy: (bridgeId) => this.client.delete(`/bridges/${bridgeId}`),
    addChannel: (bridgeId, data) =>
      this.client.post(`/bridges/${bridgeId}/addChannel`, data),
    removeChannel: (bridgeId, data) =>
      this.client.post(`/bridges/${bridgeId}/removeChannel`, data),
    play: (bridgeId, data) =>
      this.client.post(`/bridges/${bridgeId}/play`, data),
    stopPlayback: (bridgeId, playbackId) =>
      this.client.delete(`/bridges/${bridgeId}/play/${playbackId}`),
    record: (bridgeId, data) =>
      this.client.post(`/bridges/${bridgeId}/record`, data),
    stopRecord: (bridgeId, recordingName) =>
      this.client.delete(`/bridges/${bridgeId}/record/${recordingName}`),
    mohStart: (bridgeId) => this.client.post(`/bridges/${bridgeId}/moh`),
    mohStop: (bridgeId) => this.client.delete(`/bridges/${bridgeId}/moh`),
    startTalkDetect: (bridgeId) =>
      this.client.post(`/bridges/${bridgeId}/talk`),
    stopTalkDetect: (bridgeId) =>
      this.client.delete(`/bridges/${bridgeId}/talk`),
  }

  // ------------- Endpoints ----------------
  endpoints = {
    list: () => this.client.get("/endpoints"),
    listByTech: (tech) => this.client.get(`/endpoints/${tech}`),
    get: (tech, resource) => this.client.get(`/endpoints/${tech}/${resource}`),
  }

  // ------------- Recordings ----------------
  recordings = {
    listStored: () => this.client.get("/recordings/stored"),
    getStored: (name) => this.client.get(`/recordings/stored/${name}`),
    deleteStored: (name) => this.client.delete(`/recordings/stored/${name}`),
    copyStored: (name, data) =>
      this.client.post(`/recordings/stored/${name}/copy`, data),
    getLive: (name) => this.client.get(`/recordings/live/${name}`),
    stopLive: (name) => this.client.delete(`/recordings/live/${name}`),
    pauseLive: (name) => this.client.post(`/recordings/live/${name}/pause`),
    unpauseLive: (name) => this.client.delete(`/recordings/live/${name}/pause`),
    muteLive: (name) => this.client.post(`/recordings/live/${name}/mute`),
    unmuteLive: (name) => this.client.delete(`/recordings/live/${name}/mute`),
    stopAndStore: (name) => this.client.post(`/recordings/live/${name}/stop`),
  }

  // ------------- Playbacks ----------------
  playbacks = {
    get: (id) => this.client.get(`/playbacks/${id}`),
    stop: (id) => this.client.delete(`/playbacks/${id}`),
    control: (id, operation) =>
      this.client.post(`/playbacks/${id}/control`, { operation }),
    pause: (id) => this.client.post(`/playbacks/${id}/pause`),
    unpause: (id) => this.client.delete(`/playbacks/${id}/pause`),
    reverse: (id) => this.client.post(`/playbacks/${id}/reverse`),
    forward: (id) => this.client.post(`/playbacks/${id}/forward`),
  }

  // ------------- Device States ----------------
  deviceStates = {
    list: () => this.client.get("/deviceStates"),
    get: (device) => this.client.get(`/deviceStates/${device}`),
    set: (device, data) => this.client.put(`/deviceStates/${device}`, data),
    delete: (device) => this.client.delete(`/deviceStates/${device}`),
  }

  // ------------- Applications ----------------
  applications = {
    list: () => this.client.get("/applications"),
    get: (appName) => this.client.get(`/applications/${appName}`),
    subscribe: (appName, data) =>
      this.client.post(`/applications/${appName}/subscription`, data),
    unsubscribe: (appName, data) =>
      this.client.delete(`/applications/${appName}/subscription`, { data }),
    addFilter: (appName, data) =>
      this.client.post(`/applications/${appName}/eventFilter`, data),
    removeFilter: (appName, data) =>
      this.client.delete(`/applications/${appName}/eventFilter`, { data }),
  }

  // ------------- Mailboxes ----------------
  mailboxes = {
    list: () => this.client.get("/mailboxes"),
    get: (name) => this.client.get(`/mailboxes/${name}`),
    update: (name, data) => this.client.put(`/mailboxes/${name}`, data),
    delete: (name) => this.client.delete(`/mailboxes/${name}`),
  }

  // ------------- Sounds ----------------
  sounds = {
    list: () => this.client.get("/sounds"),
    get: (soundId) => this.client.get(`/sounds/${soundId}`),
  }
}
