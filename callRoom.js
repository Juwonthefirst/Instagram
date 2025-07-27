import {
	Room,
	RoomEvent,
	Track,
	createLocalAudioTrack,
	createLocalVideoTrack,
	createLocalScreenTracks,
} from './modules/livekit-client.esm.js';
import { server } from '../server.js';

const wsUrl = 'wss://test-8jnftwho.livekit.cloud'

class CallRoom {
	
	constructor(type) {
		this.room = new Room()
		this.type = type
		this.callStarted = true
		this.onTrackSubsribed = null
		this.onConnected = null
		this.onReconnecting = null
		this.onDisconnected = null
		this.onReconnected = null
		this.onVideoMuted = null
		this.onAudioMuted = null
		this.onVideoUnMuted = null
		this.onAudioUnMuted = null
		this.onAnswered = null
	}
	
	async createTracks() {
		this.localAudioTrack = await createLocalAudioTrack()
		
		if (this.type === 'video') {
			this.localVideoTrack = await createLocalVideoTrack()
			await this.localUser.publishTrack(this.localVideoTrack)
			this.videoActive = true
			
		}
		await this.localUser.publishTrack(this.localAudioTrack, {
			stopMicTrackOnMute: true
		})
	}
	
	connectEventListeners() {
		this.room.on(RoomEvent.Connected, () => this.onConnected?.())
		this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
			this.callStarted = true;
			this.callStartedAt = Date.now()
			console.log('call started')
			this.onAnswered?.()
			this.onTrackSubsribed?.(track, publication, participant)
			
		})
		this.room.on(RoomEvent.Reconnecting, () => this.onReconnecting?.())
		this.room.on(RoomEvent.Disconnected, () => this.onDisconnected?.())
		this.room.on(RoomEvent.Reconnected, () => this.onReconnected?.())
		this.room.on(RoomEvent.ParticipantConnected, () => {
			
		})
		this.room.on(RoomEvent.ParticipantDisconnected, async () => {
			await this.room.disconnect()
		})
		this.room.on(RoomEvent.TrackMuted, (publication, participant) => {
			if (publication.isLocal) return
			publication.track.kind === 'audio' ? this.onAudioMuted?.() : this.onVideoMuted?.()
		})
		this.room.on(RoomEvent.TrackUnmuted, (publication, participant) => {
			if (participant.isLocal) return
			publication.track.kind === 'audio' ? this.onAudioUnMuted?.() : this.onVideoUnMuted?.()
		})
	}
	
	async startCall(room_name) {
		this.connectEventListeners()
		const token = await server.getLiveKitJWT(room_name)
		await this.room.connect(wsUrl, token)
		this.localUser = this.room.localParticipant
		await this.createTracks()
	}
	
	async endCall() {
		if (!this.callStarted) return
		await this.localVideoTrack?.stop()
		await this.room.disconnect()
	}
	
	async openCamera() {
		if (!this.callStarted) return
		await this.localVideoTrack.unmute()
		this.videoActive = true
	}
	
	async closeCamera() {
		if (!this.callStarted) return
		await this.localVideoTrack.unmute()
		this.videoActive = false
	}
	
	async openScreenSharing() {
		if (this.localScreenTrack) return await this.localScreenTrack.enable()
		
		const screenTracks = await createLocalScreenTracks()
		for (let track of screenTracks) {
			if (track.kind === 'video') {
				this.localScreenTrack = track
			}
		}
		await this.localUser.publishTrack(this.localScreenTrack, {
			source: Track.Source.ScreenShare
		})
	}
	
	async closeScreenSharing() {
		if (!this.localScreenTrack) return
		await this.localUser.unpublishTrack(this.localScreenTrack)
		this.localScreenTrack = null
	}
	
	async muteVideo() {
		if (!this.callStarted) return
		await this.localVideoTrack?.mute()
		this.videoActive = false
	}
	async muteAudio() {
		if (!this.callStarted) return
		await this.localAudioTrack.mute()
		this.audioMuted = true
	}
	
	async unMuteVideo() {
		if (!this.callStarted) return
		if (this.localVideoTrack === undefined) {
			this.localVideoTrack = await createLocalVideoTrack()
			await this.localUser.publishTrack(this.localVideoTrack)
		}
		await this.localVideoTrack.unmute()
		this.videoActive = true
	}
	
	async unMuteAudio() {
		if (!this.callStarted) return
		await this.localAudioTrack.unmute()
		this.audioMuted = false
	}
	
	async swapCamera() {
		await this.localVideoTrack.switchCamera()
	}
	
	async captureVideoFrame() {
		await this.localVideoTrack.captureFrame()
	}
	
}

export { CallRoom }