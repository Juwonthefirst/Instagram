import { 
	Room, RoomEvent, Track, 
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
		this.callStarted = false
		this.onTrackSubsribed = null
		this.onReconnecting = null
		this.onDisconnected = null
		this.onReconnected = null
		this.onVideoMuted = null
		this.onAudioMuted = null
		this.onVideoUnMuted = null
		this.onAudioUnMuted = null
		this.onCallEnd = null
		this.onCallStart = null
		this.onAnswered = null
	}
	
	async createTracks() {
		this.localAudioTrack = await createLocalAudioTrack()
		this.localVideoTrack = await createLocalVideoTrack()
		if (this.type !== 'video') {
			this.localVideoTrack.disable()
		}
		await this.localUser.publish(this.localAudioTrack)
		await this.localUser.publish(this.localVideoTrack)
	}
	
	connectEventListeners() {
		this.room.on(RoomEvent.TrackSubscribed, () => this.onTrackSubsribed?.(track, publication, participant))
		this.room.on(RoomEvent.Reconnecting, () => this.onReconnecting?.())
		this.room.on(RoomEvent.Disconnected, () => this.onDisconnected?.())
		this.room.on(RoomEvent.Reconnected, () => this.onReconnected?.())
		this.room.on(RoomEvent.ParticipantConnected, () => {
			this.callStarted = true;
			this.callStartedAt = new Date.now()
			this.onAnswered?.()
		})
		this.room.on(RoomEvent.ParticipantDisconnected, async () => {
			await this.room.disconnect()
		})
		this.room.on(RoomEvent.TrackMuted, (track, publication, participant) => {
			track.kind === 'audio' ? this.onAudioMuted?.() : this.onVideoMuted?.()
		})
		this.room.on(RoomEvent.TrackUnMuted, (track, publication, participant) => {
			track.kind === 'audio'? this.onAudioUnMuted?.() : this.onVideoUnMuted?.()
		})
	}
	
	async startCall(room_name) {
		this.connectEventListeners()
		const token = await server.getLiveKitJWT(room_name)
		await this.room.connect(wsUrl, token)
		this.localUser = this.room.localParticipant
		await this.createTracks()
		this.onCallStart?.()
	}
	
	async endCall(){
		if (!this.callStarted) return 
		await this.room.disconnect()
		this.onCallEnd?.()
	}
	
	async openCamera() {
		if (!this.callStarted) return 
		await this.localVideoTrack.enable()
		this.videoActive = true
	}
	
	async closeCamera() {
		if (!this.callStarted) return 
		await this.localVideoTrack.disable()
		this.videoActive = false
	}
	
	async openScreenSharing() {
		if (this.localScreenTrack) return await this.localScreenTrack.enable()
		
		const screenTracks = createLocalScreenTracks()
		for (let track of screenTracks) {
			if (track.kind === 'video'){
				this.localScreenTrack = track
			}
		}
		await this.localUser.publish(this.localScreenTrack, {
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
		await this.localVideoTrack.mute()
		this.videoActive = false
	}
	async muteAudio() {
		if (!this.callStarted) return 
		await this.localAudioTrack.mute()
		this.audioMuted = true
	}
	
	async unMuteVideo() {
		if (!this.callStarted) return 
		await this.localVideoTrack.unmute()
		this.videoActive = true
	}
	
	async unMuteAudio() {
		if (!this.callStarted) return 
		await this.localAudioTrack.unmute()
		this.audioMuted = false
	}
	
	async swapCamera(){
		await this.localVideoTrack.switchCamera()
	}
	
	async captureVideoFrame(){
		await this.localVideoTrack.captureFrame()
	}
	
}

export { CallRoom }