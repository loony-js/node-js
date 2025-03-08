/**
 * generated based on Exiv2 and Exif information, do not change manually
 * - https://exiv2.org/tags.html
 * - https://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf
 */

declare function exif(buffer: Buffer): exif.Exif
export = exif

declare namespace exif {
  type Exif = {
    bigEndian: boolean
    Image?: Partial<ImageTags>
    Photo?: Partial<PhotoTags>
    Iop?: Partial<IopTags>
    GPSInfo?: Partial<GPSInfoTags>
    ThumbnailTags?: Partial<ImageTags>
  }

  type ImageTags = Record<string, GenericTag> & {
    ProcessingSoftware: string
    NewSubfileType: number
    SubfileType: number
    ImageWidth: number
    ImageLength: number
    BitsPerSample: number[]
    Compression: number
    PhotometricInterpretation: number
    Thresholding: number
    CellWidth: number
    CellLength: number
    FillOrder: number
    DocumentName: string
    ImageDescription: string
    Make: string
    Model: string
    StripOffsets: number[]
    Orientation: number
    SamplesPerPixel: number
    RowsPerStrip: number
    StripByteCounts: number[]
    XResolution: number
    YResolution: number
    PlanarConfiguration: number
    PageName: string
    XPosition: number
    YPosition: number
    GrayResponseUnit: number
    GrayResponseCurve: number
    T4Options: number
    T6Options: number
    ResolutionUnit: number
    PageNumber: number
    TransferFunction: number[]
    Software: string
    DateTime: Date
    Artist: string
    HostComputer: string
    Predictor: number
    WhitePoint: number[]
    PrimaryChromaticities: number[]
    ColorMap: number
    HalftoneHints: number
    TileWidth: number
    TileLength: number
    TileOffsets: number
    TileByteCounts: number
    SubIFDs: number
    InkSet: number
    InkNames: string
    NumberOfInks: number
    DotRange: number
    TargetPrinter: string
    ExtraSamples: number
    SampleFormat: number
    SMinSampleValue: number
    SMaxSampleValue: number
    TransferRange: number
    ClipPath: number
    XClipPathUnits: number
    YClipPathUnits: number
    Indexed: number
    JPEGTables: Buffer
    OPIProxy: number
    JPEGProc: number
    JPEGInterchangeFormat: number
    JPEGInterchangeFormatLength: number
    JPEGRestartInterval: number
    JPEGLosslessPredictors: number
    JPEGPointTransforms: number
    JPEGQTables: number
    JPEGDCTables: number
    JPEGACTables: number
    YCbCrCoefficients: number[]
    YCbCrSubSampling: number[]
    YCbCrPositioning: number
    ReferenceBlackWhite: number[]
    XMLPacket: number
    Rating: number
    RatingPercent: number
    VignettingCorrParams: number
    ChromaticAberrationCorrParams: number
    DistortionCorrParams: number
    ImageID: string
    CFARepeatPatternDim: number
    CFAPattern: number
    BatteryLevel: number
    Copyright: string
    ExposureTime: number
    FNumber: number
    IPTCNAA: number
    ImageResources: number
    ExifTag: number
    InterColorProfile: Buffer
    ExposureProgram: number
    SpectralSensitivity: string
    GPSTag: number
    ISOSpeedRatings: number
    OECF: Buffer
    Interlace: number
    TimeZoneOffset: number
    SelfTimerMode: number
    DateTimeOriginal: string
    CompressedBitsPerPixel: number
    ShutterSpeedValue: number
    ApertureValue: number
    BrightnessValue: number
    ExposureBiasValue: number
    MaxApertureValue: number
    SubjectDistance: number
    MeteringMode: number
    LightSource: number
    Flash: number
    FocalLength: number
    FlashEnergy: number
    SpatialFrequencyResponse: Buffer
    Noise: Buffer
    FocalPlaneXResolution: number
    FocalPlaneYResolution: number
    FocalPlaneResolutionUnit: number
    ImageNumber: number
    SecurityClassification: string
    ImageHistory: string
    SubjectLocation: number
    ExposureIndex: number
    TIFFEPStandardID: number
    SensingMethod: number
    XPTitle: number
    XPComment: number
    XPAuthor: number
    XPKeywords: number
    XPSubject: number
    PrintImageMatching: Buffer
    DNGVersion: number
    DNGBackwardVersion: number
    UniqueCameraModel: string
    LocalizedCameraModel: number
    CFAPlaneColor: number
    CFALayout: number
    LinearizationTable: number
    BlackLevelRepeatDim: number
    BlackLevel: number
    BlackLevelDeltaH: number
    BlackLevelDeltaV: number
    WhiteLevel: number
    DefaultScale: number
    DefaultCropOrigin: number
    DefaultCropSize: number
    ColorMatrix1: number
    ColorMatrix2: number
    CameraCalibration1: number
    CameraCalibration2: number
    ReductionMatrix1: number
    ReductionMatrix2: number
    AnalogBalance: number
    AsShotNeutral: number
    AsShotWhiteXY: number
    BaselineExposure: number
    BaselineNoise: number
    BaselineSharpness: number
    BayerGreenSplit: number
    LinearResponseLimit: number
    CameraSerialNumber: string
    LensInfo: number
    ChromaBlurRadius: number
    AntiAliasStrength: number
    ShadowScale: number
    DNGPrivateData: number
    MakerNoteSafety: number
    CalibrationIlluminant1: number
    CalibrationIlluminant2: number
    BestQualityScale: number
    RawDataUniqueID: number
    OriginalRawFileName: number
    OriginalRawFileData: Buffer
    ActiveArea: number
    MaskedAreas: number
    AsShotICCProfile: Buffer
    AsShotPreProfileMatrix: number
    CurrentICCProfile: Buffer
    CurrentPreProfileMatrix: number
    ColorimetricReference: number
    CameraCalibrationSignature: number
    ProfileCalibrationSignature: number
    ExtraCameraProfiles: number
    AsShotProfileName: number
    NoiseReductionApplied: number
    ProfileName: number
    ProfileHueSatMapDims: number
    ProfileHueSatMapData1: Buffer
    ProfileHueSatMapData2: Buffer
    ProfileToneCurve: Buffer
    ProfileEmbedPolicy: number
    ProfileCopyright: number
    ForwardMatrix1: number
    ForwardMatrix2: number
    PreviewApplicationName: number
    PreviewApplicationVersion: number
    PreviewSettingsName: number
    PreviewSettingsDigest: number
    PreviewColorSpace: number
    PreviewDateTime: string
    RawImageDigest: Buffer
    OriginalRawFileDigest: Buffer
    SubTileBlockSize: number
    RowInterleaveFactor: number
    ProfileLookTableDims: number
    ProfileLookTableData: Buffer
    OpcodeList1: Buffer
    OpcodeList2: Buffer
    OpcodeList3: Buffer
    NoiseProfile: Buffer
    TimeCodes: number
    FrameRate: number
    TStop: number
    ReelName: string
    CameraLabel: string
    OriginalDefaultFinalSize: number
    OriginalBestQualityFinalSize: number
    OriginalDefaultCropSize: number
    ProfileHueSatMapEncoding: number
    ProfileLookTableEncoding: number
    BaselineExposureOffset: number
    DefaultBlackRender: number
    NewRawImageDigest: number
    RawToPreviewGain: Buffer
    DefaultUserCrop: number
    DepthFormat: number
    DepthNear: number
    DepthFar: number
    DepthUnits: number
    DepthMeasureType: number
    EnhanceParams: string
    ProfileGainTableMap: Buffer
    SemanticName: string
    SemanticInstanceID: string
    CalibrationIlluminant3: number
    CameraCalibration3: number
    ColorMatrix3: number
    ForwardMatrix3: number
    IlluminantData1: Buffer
    IlluminantData2: Buffer
    IlluminantData3: Buffer
    MaskSubArea: number
    ProfileHueSatMapData3: Buffer
    ReductionMatrix3: number
    RGBTables: Buffer
  }

  type PhotoTags = Record<string, GenericTag> & {
    ExposureTime: number
    FNumber: number
    ExposureProgram: number
    SpectralSensitivity: string
    ISOSpeedRatings: number
    OECF: Buffer
    SensitivityType: number
    StandardOutputSensitivity: number
    RecommendedExposureIndex: number
    ISOSpeed: number
    ISOSpeedLatitudeyyy: number
    ISOSpeedLatitudezzz: number
    ExifVersion: Buffer
    DateTimeOriginal: Date
    DateTimeDigitized: Date
    OffsetTime: string
    OffsetTimeOriginal: string
    OffsetTimeDigitized: string
    ComponentsConfiguration: Buffer
    CompressedBitsPerPixel: number
    ShutterSpeedValue: number
    ApertureValue: number
    BrightnessValue: number
    ExposureBiasValue: number
    MaxApertureValue: number
    SubjectDistance: number
    MeteringMode: number
    LightSource: number
    Flash: number
    FocalLength: number
    SubjectArea: number[]
    MakerNote: Buffer
    UserComment: Buffer
    SubSecTime: string
    SubSecTimeOriginal: string
    SubSecTimeDigitized: string
    Temperature: number
    Humidity: number
    Pressure: number
    WaterDepth: number
    Acceleration: number
    CameraElevationAngle: number
    FlashpixVersion: Buffer
    ColorSpace: number
    PixelXDimension: number
    PixelYDimension: number
    RelatedSoundFile: string
    InteroperabilityTag: number
    FlashEnergy: number
    SpatialFrequencyResponse: Buffer
    FocalPlaneXResolution: number
    FocalPlaneYResolution: number
    FocalPlaneResolutionUnit: number
    SubjectLocation: number[]
    ExposureIndex: number
    SensingMethod: number
    FileSource: Buffer
    SceneType: Buffer
    CFAPattern: Buffer
    CustomRendered: number
    ExposureMode: number
    WhiteBalance: number
    DigitalZoomRatio: number
    FocalLengthIn35mmFilm: number
    SceneCaptureType: number
    GainControl: number
    Contrast: number
    Saturation: number
    Sharpness: number
    DeviceSettingDescription: Buffer
    SubjectDistanceRange: number
    ImageUniqueID: string
    CameraOwnerName: string
    BodySerialNumber: string
    LensSpecification: number[]
    LensMake: string
    LensModel: string
    LensSerialNumber: string
    CompositeImage: number
    SourceImageNumberOfCompositeImage: number
    SourceExposureTimesOfCompositeImage: Buffer
    Gamma: number
  }

  type IopTags = Record<string, GenericTag> & {
    InteroperabilityIndex: string
    InteroperabilityVersion: Buffer
    RelatedImageFileFormat: string
    RelatedImageWidth: number
    RelatedImageLength: number
  }

  type GPSInfoTags = Record<string, GenericTag> & {
    GPSVersionID: number[]
    GPSLatitudeRef: string
    GPSLatitude: number[]
    GPSLongitudeRef: string
    GPSLongitude: number[]
    GPSAltitudeRef: number
    GPSAltitude: number
    GPSTimeStamp: number[]
    GPSSatellites: string
    GPSStatus: string
    GPSMeasureMode: string
    GPSDOP: number
    GPSSpeedRef: string
    GPSSpeed: number
    GPSTrackRef: string
    GPSTrack: number
    GPSImgDirectionRef: string
    GPSImgDirection: number
    GPSMapDatum: string
    GPSDestLatitudeRef: string
    GPSDestLatitude: number[]
    GPSDestLongitudeRef: string
    GPSDestLongitude: number[]
    GPSDestBearingRef: string
    GPSDestBearing: number
    GPSDestDistanceRef: string
    GPSDestDistance: number
    GPSProcessingMethod: Buffer
    GPSAreaInformation: Buffer
    GPSDateStamp: string
    GPSDifferential: number
    GPSHPositioningError: number
  }

  type GenericTag = number | number[] | string | Buffer
}
