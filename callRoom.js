import { Room, RoomEvent, createLocalAudioTrack, createLocalVideoTrack, createLocalScreenTracks } from './modules/livekit-client.esm.js';
import { server } from '../server.js';

const wsUrl = 'wss://test-8jnftwho.livekit.cloud'

class CallRoom {
	constructor(type) {
		this.room = new Room()
		this.type = type
		this.callStarted = false
		this.onTrackSubsribed = null
		this.onReconnecting = null
		this.onDisconnected = null
		this.onReconnected = null
		this.onVideoMuted = null
		this.onAudioMuted = null
		this.onVideoUnMuted = null
		this.onAudioUnMuted = null
	}
	
	createTracks() {
		this.localAudioTrack = createLocalAudioTrack()
		this.localVideoTrack = createLocalVideoTrack()
		if (this.type !== 'video') {
			this.localVideoTrack.disable()
		}
		this.localUser.publish(this.localAudioTrack)
		this.localUser.publish(this.localVideoTrack)
	}
	
	connectEventListeners() {
		this.room.on(RoomEvent.TrackSubscribed, () => this.onTrackSubsribed(track, publication, participant))
		this.room.on(RoomEvent.Reconnecting, () => this.onReconnecting())
		this.room.on(RoomEvent.Disconnected, () => this.onDisconnected())
		this.room.on(RoomEvent.Reconnected, () => this.onReconnected())
		this.room.on(RoomEvent.ParticipantConnected, () => {
			this.callStarted = true;
			this.callStartedAt = new Date.now()
		})
		this.room.on(RoomEvent.ParticipantDisconnected, () => {
			this.room.disconnect()
		})
		this.room.on(RoomEvent.TrackMuted, (track, publication, participant) => {
			track.kind === 'audio' ? this.onAudioMuted() : this.onVideoMuted()
		})
		this.room.on(RoomEvent.TrackUnMuted, (track, publication, participant) => {
			track.kind === 'audio' ? this.onAudioUnMuted() : this.onVideoUnMuted()
		})
	}
	
	async startCall(room_name) {
		this.connectEventListeners()
		const token = await server.getLiveKitJWT(room_name)
		await this.room.connect(wsUrl, token)
		this.localUser = this.room.localParticipant
		this.createTracks()
	}
	
	async openVideo() {
		await this.localVideoTrack.enable()
		this.type = 'video'
	}
	
	async closeVideo() {
		await this.localVideoTrack.disable()
		this.type = 'audio'
	}
	
	async openScreenSharing() {
		this.localScreenTrack = createLocalScreenTracks()
		this.localUser.publish(this.localScreenTrack)
	}
	
	async closeScreenSharing() {
		
	}
	
	async muteVideo() {
		await this.localVideoTrack.mute()
	}
	async muteAudio() {
		await this.localAudioTrack.mute()
	}
}