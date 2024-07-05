import { logDev } from "../scripts/helpers";

export interface Asset {
  id: string;
  type: string;
  playbackId: string;
  staticMp4: boolean;
  c2pa: boolean;
  playbackUrl: string;
  downloadUrl: string;
  playbackPolicy: PlaybackPolicy;
  source: Source;
  creatorId: Record<string, any>;
  storage: Storage;
  status: Status;
  name: string;
  createdAt: number;
  size: number;
  hash: Hash[];
  videoSpec: VideoSpec;
}

export interface PlaybackPolicy {
  type: string; //values: Public, jwt, webhook
  webhookId: string; // ID of the webhook to use for playback policy
  webhookContext: WebhookContext; //User-defined webhook context
  refreshInterval: number; //Interval (in seconds) at which the playback policy should be refreshed (default 600 seconds)
  allowedOrigins: string[]; // List of allowed origins for CORS playback (://:, ://)
}

export interface WebhookContext {
  foo: string;
}

export interface Source {
  type: string;
  url: string;
  gatewayUrl: string;
}

export interface Storage {
  ipfs: Ipfs;
}

export interface NewAssetEncryption {
  encryptedKey: string // Encryption key used to encrypt the asset. Only writable in the upload asset endpoints and cannot be retrieved back. 
}

export interface Ipfs {
  spec: Spec;
}

export interface Spec {
  nftMetadataTemplate: string;
  nftMetadata: NftMetadata;
}

export interface NftMetadata {
  name: string;
  description: string;
}

export interface Status {
  phase: string;
  updatedAt: number;
  progress: number;
}

export interface Hash {
  hash: string;
  algorithm: string;
}

export interface VideoSpec {
  format: string;
  duration: number;
  bitrate: number;
  tracks: Track[];
}

export interface TranscodeProfile {
  width?: number; // Width of the video in pixels
  name?: string; // Name of the profile
  height?: number; // Height of the video in pixels
  bitrate: number; // Bitrate of the video
  quality?: number; // Quality parameter for the output video
  fps?: number; // Frames per second
  fpsDen?: number; // FPS denominator
  gop?: string; // Group of pictures size
  profile?: string; // Profile setting for the transcoding (options: H264Baseline, H264Main, H264High, H264ConstrainedHigh)
  encoder?: string; // Encoder setting for the transcoding (options: H.264, HEVC, VP8, VP9)
}


export interface Track {
  type: string;
  codec: string;
  startTime: number;
  duration: number;
  bitrate: number;
  width?: number;
  height?: number;
  pixelFormat?: string;
  fps?: number;
  channels?: number;
  sampleRate?: number;
  bitDepth?: number;
}

export interface RequestUpload {
  request: { //The request object to use for the request.
    name: string; // The name of the asset
    staticMp4?: boolean; // Whether to generate MP4s for the asset
    playbackPolicy?: PlaybackPolicy; // The playback policy for an asset or stream
    creatorId?: string; // Creator ID information
    storage?: Storage; // Storage information
    encryption?: NewAssetEncryption; // Encryption information
    c2pa?: boolean; // Whether the output video should include C2PA signature
    profiles?: TranscodeProfile[]; // Array of transcode profiles
    targetSegmentSizeSecs?: number; // Duration of each output segment in seconds
  }, 
  options?: {}, //Used to set various options for making HTTP requests.
  fetchOptions?:{} // Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All Request options, except method and body, are allowed.
}

export interface RequestUploadResponse {
  contentType: string; // HTTP response content type for this operation
  statusCode: number; // HTTP response status code for this operation
  rawResponse: Response; // Raw HTTP response; suitable for custom response parsing
  data?: RequestUploadData; // Data on success
  error?: Error; // Error information
}

export interface RequestUploadData {
  url: string; // The direct upload endpoint supporting PUT requests
  tusEndpoint: string; // The Tus-compatible endpoint for resumable uploads
  asset: Asset; // Asset information
  task: Task; // Task information
}

export interface Task {
  id: string; 
}

const testType = (type: string, result: string, data: string = "") => {
  logDev(`Type Test: ${type} => ${result} => ${data}`, {type, result, data})
}
const ActionTypes = {
  AssetUpload: {
    request: testType("RequestUpload","RequestUploadResponse", "RequestUploadData"),
    upload: testType("tusUpload", "response listners", 'upload: { url }')
  }
}
