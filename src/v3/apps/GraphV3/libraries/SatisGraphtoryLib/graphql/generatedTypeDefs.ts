const generatedTypeDefs = `

  enum ResourceFormEnum {
    InvalidResourceForm
    RF_LIQUID
    RF_SOLID  
  }

  enum ResourceEnum {
    InvalidResource
    Water
    OreIron
    OreCopper
    Stone
    Coal
    LiquidOil
    OreBauxite
    OreGold
    OreUranium
    RawQuartz
    Sulfur
    UraniumCell
    UraniumPellet
    CompactedCoal
    PackagedOil
    PackagedWater  
  }

  enum SatisGraphtoryNodeEnum {
    InvalidSatisGraphtoryNode
    WaterPump
    MinerMk1
    OilPump
    MinerMk2
    MinerMk3
    FoundryMk1
    SmelterMk1
    ConstructorMk1
    OilRefinery
    AssemblerMk1
    ManufacturerMk1
    Converter
    BuildGun
    WorkBenchComponent
    PipeStorageTank
    IndustrialTank
    StorageContainerMk1
    StorageContainerMk2
    ConveyorAttachmentMerger
    ConveyorAttachmentSplitter
    ConveyorAttachmentSplitterSmart
    ConveyorAttachmentSplitterProgrammable
    PipelineJunction_Cross  
  }

  enum RecipeEnum {
    InvalidRecipe
    ConveyorPole
    ConveyorBeltMk1
    PowerLine
    PowerPoleMk1
    TradingPost
    SpaceElevator
    ConstructorMk1
    MinerMk1
    SmelterBasicMk1
    StorageContainerMk1
    WorkBench
    Workshop
    PortableMiner
    Cable
    Wire
    IngotCopper
    IronPlateReinforced
    Concrete
    Screw
    Biomass_Leaves
    Biomass_Wood
    GeneratorBiomass
    Biofuel
    IronPlate
    IronRod
    XenoZapper
    Coal
    CrudeOil
    Limestone
    OreBauxite
    OreCaterium
    OreCopper
    OreIron
    OreUranium
    RawQuartz
    Sulfur
    IngotIron
    Fence_01
    Stair_1b
    Wall_Conveyor_8x4_04
    Wall_Conveyor_8x4_04_Steel
    Wall_Window_8x4_03
    Wall_Window_8x4_03_Steel
    Alternate_AdheredIronPlate
    CircuitBoard
    OilPump
    OilRefinery
    LiquidFuel
    PetroleumCoke
    Plastic
    Rubber
    ResidualFuel
    ResidualPlastic
    ResidualRubber
    Alternate_BoltedFrame
    ModularFrame
    Rotor
    AssemblerMk1
    CopperSheet
    SpaceElevatorPart_1
    Alternate_CoatedCable
    Alternate_CoatedIronPlate
    Alternate_CokeSteelIngot
    Alternate_CopperAlloyIngot
    Alternate_CopperRotor
    Alternate_DilutedPackagedFuel
    Alternate_ElectroAluminumScrap
    ElectromagneticControlRod
    UraniumCell
    ConveyorBeltMk5
    ConveyorLiftMk5
    GeneratorNuclear
    AluminumSheet
    NuclearFuelRod
    FilterHazmat
    HazmatSuit
    AluminaSolution
    AluminumScrap
    IngotAluminum
    Alternate_ElectrodeCircuitBoard
    Alternate_FlexibleFramework
    Alternate_FusedWire
    PowerPoleMk2
    PowerPoleWallDoubleMk2
    PowerPoleWallMk2
    Quickwire
    BladeRunners
    IngotCaterium
    Alternate_HeavyFlexibleFrame
    ManufacturerMk1
    Computer
    ModularFrameHeavy
    SpaceElevatorPart_4
    SpaceElevatorPart_5
    Truck
    Alternate_HeavyOilResidue
    Alternate_HighSpeedWiring
    EncasedIndustrialBeam
    Motor
    Stator
    MinerMk2
    SpaceElevatorPart_3
    AILimiter
    Alternate_PlasticSmartPlating
    Alternate_PolyesterFabric
    Fabric
    Alternate_PolymerResin
    PureAluminumIngot
    Alternate_PureCateriumIngot
    GeneratorCoal
    PipeSupport
    Pipeline
    PipelineJunction_Cross
    PipelinePump
    PipeStorageTank
    WaterPump
    Alternate_PureCopperIngot
    Alternate_PureIronIngot
    Alternate_PureQuartzCrystal
    QuartzCrystal
    Alternate_RecycledRubber
    Alternate_RubberConcrete
    Alternate_SteamedCopperSheet
    Alternate_SteelCoatedPlate
    Alternate_SteelRod
    SmelterMk1
    SteelBeam
    SteelPipe
    IngotSteel
    SpaceElevatorPart_2
    Alternate_TurboHeavyFuel
    PackagedTurboFuel
    UnpackageTurboFuel
    Alternate_Coal_1
    Alternate_Coal_2
    Alternate_EnrichedCoal
    Alternate_WetConcrete
    Alternate_Beacon_1
    Alternate_Cable_1
    Alternate_Cable_2
    Alternate_CircuitBoard_1
    Alternate_CircuitBoard_2
    Alternate_Computer_1
    Alternate_Computer_2
    Alternate_Concrete
    Alternate_CrystalOscillator
    CrystalOscillator
    Alternate_ElectromagneticControlRod_1
    TrainDockingStation
    TrainStation
    RailroadTrack
    SulfuricAcid
    UraniumPellet
    FreightWagon
    Locomotive
    Alternate_Gunpowder_1
    Alternate_HeatSink_1
    HeatSink
    MinerMk3
    Battery
    MotorTurbo
    RadioControlUnit
    Alternate_ModularFrameHeavy
    Alternate_HighSpeedConnector
    HighSpeedConnector
    Alternate_IngotIron
    Alternate_IngotSteel_1
    Alternate_IngotSteel_2
    Alternate_ModularFrame
    Alternate_Motor_1
    Alternate_Nobelisk_1
    Nobelisk
    Alternate_NuclearFuelRod_1
    Alternate_Plastic_1
    Alternate_Quickwire
    Alternate_RadioControlUnit_1
    Alternate_ReinforcedIronPlate_1
    Alternate_ReinforcedIronPlate_2
    Alternate_EncasedIndustrialBeam
    Alternate_Rotor
    Alternate_Screw
    Alternate_Screw_2
    Alternate_Silica
    Silica
    Alternate_Stator
    Alternate_Turbofuel
    Alternate_TurboMotor_1
    Alternate_UraniumCell_1
    Alternate_Wire_1
    Alternate_Wire_2
    Foundation_8x1_01
    Foundation_8x2_01
    Foundation_8x4_01
    Ramp_8x1_01
    Ramp_8x2_01
    Ramp_8x4_01
    LookoutTower
    Wall_8x4_01
    Wall_8x4_02
    ConveyorAttachmentMerger
    ConveyorAttachmentSplitter
    ConveyorLiftMk1
    Mam
    StoragePlayer
    Beacon
    ObjectScanner
    Chainsaw
    JumpPad
    JumpPadTilted
    UJellyLandingPad
    ResourceSink
    ResourceSinkShop
    ConveyorBeltMk2
    ConveyorLiftMk2
    ConveyorPoleStackable
    TruckStation
    Tractor
    XenoBasher
    PipeHyperStart
    PipeHyperSupport
    PipeHyper
    ConveyorBeltMk3
    ConveyorLiftMk3
    PipeSupportStackable
    StorageContainerMk2
    UnpackageBioFuel
    UnpackageFuel
    UnpackageOil
    UnpackageOilResidue
    UnpackageWater
    IndustrialTank
    FluidCanister
    Fuel
    LiquidBiofuel
    PackagedBiofuel
    PackagedCrudeOil
    PackagedOilResidue
    PackagedWater
    ConveyorBeltMk4
    ConveyorLiftMk4
    GeneratorFuel
    JetPack
    TrainDockingStationLiquid
    TrainPlatformEmpty
    FilterGasMask
    Gasmask
    Biomass_AlienCarapace
    RebarGun
    SpikedRebar
    Biomass_AlienOrgans
    MedicinalInhalerAlienOrgans
    ConveyorAttachmentSplitterSmart
    ComputerSuper
    PowerPoleMk3
    ConveyorAttachmentSplitterProgrammable
    GeneratorGeoThermal
    ColorGun
    ColorCartridge
    Biomass_Mycelia
    Parachute
    MedicinalInhaler
    NutritionalInhaler
    PowerCrystalShard_1
    PowerCrystalShard_2
    PowerCrystalShard_3
    Explorer
    RadarTower
    Gunpowder
    NobeliskDetonator
    SpaceRifleMk1
    Cartridge
    Wall_Conveyor_8x4_01_Steel
    Wall_Conveyor_8x4_02_Steel
    Wall_Conveyor_8x4_03_Steel
    Wall_Conveyor_8x4_01
    Wall_Conveyor_8x4_02
    Wall_Conveyor_8x4_03
    ConveyorPoleWall
    QuarterPipe
    QuarterPipe_02
    QuarterPipeCorner_01
    QuarterPipeCorner_02
    CyberWagon
    Ramp_Diagonal_8x1_01
    Ramp_Diagonal_8x1_02
    Ramp_Diagonal_8x2_01
    Ramp_Diagonal_8x2_02
    Ramp_Diagonal_8x4_01
    Ramp_Diagonal_8x4_02
    Wall_Door_8x4_01_Steel
    Wall_Door_8x4_02_Steel
    Wall_Door_8x4_03_Steel
    Wall_Door_8x4_01
    Wall_Door_8x4_02
    Wall_Door_8x4_03
    Wall_Gate_8x4_01
    FactoryCart
    PillarBase
    PillarMiddle
    PillarTop
    Ramp_8x4_Inverted_01
    Ramp_8x8x8
    Foundation_Frame_01
    FoundationGlass_01
    PipeSupportWall
    PipeSupportWallHole
    Stairs_Left_01
    Stairs_Right_01
    Walkway_Cross
    Walkway_Ramp
    Walkway_Straight
    Walkway_T
    Walkway_Turn
    PowerPoleWall
    PowerPoleWallDouble
    PowerPoleWallDoubleMk3
    PowerPoleWallMk3
    Wall_Window_8x4_01
    Wall_Window_8x4_02
    Wall_Window_8x4_04  
  }

  enum ItemEnum {
    InvalidItem
    ConveyorPole
    PipelineSupport
    ConveyorPoleStackable
    PipeHyperSupport
    PipeSupportStackable
    Cement
    IronPlate
    IronRod
    CrystalShard
    Fuel
    HazmatFilter
    SpikedRebar
    CartridgeStandard
    HUBParts
    Wire
    Filter
    Cable
    IronPlateReinforced
    CopperIngot
    IronScrew
    SpaceElevatorPart_1
    SpaceElevatorPart_2
    SpaceElevatorPart_3
    SpaceElevatorPart_4
    SpaceElevatorPart_5
    IronIngot
    AluminumPlate
    Motor
    Rubber
    CircuitBoard
    CopperSheet
    Plastic
    SteelPlateReinforced
    SteelPipe
    LiquidFuel
    PolymerResin
    HeavyOilResidue
    PetroleumCoke
    ModularFrame
    Rotor
    SteelIngot
    PackagedOilResidue
    AluminaSolution
    AluminumScrap
    CircuitBoardHighSpeed
    ElectromagneticControlRod
    Stator
    ComputerSuper
    HighSpeedConnector
    ModularFrameHeavy
    AluminumIngot
    HighSpeedWire
    Silica
    Computer
    SteelPlate
    GoldIngot
    QuartzCrystal
    LiquidTurboFuel
    FluidCanister
    TurboFuel
    CrystalOscillator
    SulfuricAcid
    Gunpowder
    AluminumPlateReinforced
    MotorLightweight
    Battery
    ModularFrameLightweight
    NobeliskExplosive
    Crystal
    ColorCartridge
    Crystal_mk2
    Crystal_mk3
    ConveyorBeltMk1
    PowerLine
    PowerPoleMk1
    TradingPost
    SpaceElevator
    ConstructorMk1
    MinerMk1
    SmelterMk1
    StorageContainerMk1
    WorkBench
    Workshop
    GeneratorBiomass
    Fence_01
    Stair_1b
    Wall_Conveyor_8x4_04
    Wall_Conveyor_8x4_04_Steel
    Wall_Window_8x4_03
    Wall_Window_8x4_03_Steel
    OilPump
    OilRefinery
    AssemblerMk1
    ConveyorBeltMk5
    ConveyorLiftMk5
    GeneratorNuclear
    PowerPoleMk2
    PowerPoleWallDoubleMk2
    PowerPoleWallMk2
    ManufacturerMk1
    MinerMk2
    GeneratorCoal
    Pipeline
    PipelineJunction_Cross
    PipelinePump
    PipeStorageTank
    WaterPump
    FoundryMk1
    TrainDockingStation
    TrainStation
    RailroadTrack
    MinerMk3
    Foundation_8x1_01
    Foundation_8x2_01
    Foundation_8x4_01
    Ramp_8x1_01
    Ramp_8x2_01
    Ramp_8x4_01
    LookoutTower
    Wall_8x4_01
    Wall_8x4_02
    ConveyorAttachmentMerger
    ConveyorAttachmentSplitter
    ConveyorLiftMk1
    Mam
    StoragePlayer
    JumpPad
    JumpPadTilted
    LandingPad
    ResourceSink
    ResourceSinkShop
    ConveyorBeltMk2
    ConveyorLiftMk2
    TruckStation
    PipeHyperStart
    PipeHyper
    ConveyorBeltMk3
    ConveyorLiftMk3
    StorageContainerMk2
    IndustrialTank
    ConveyorBeltMk4
    ConveyorLiftMk4
    GeneratorFuel
    TrainDockingStationLiquid
    TrainPlatformEmpty
    ConveyorAttachmentSplitterSmart
    PowerPoleMk3
    ConveyorAttachmentSplitterProgrammable
    GeneratorGeoThermal
    RadarTower
    Wall_Conveyor_8x4_01_Steel
    Wall_Conveyor_8x4_02_Steel
    Wall_Conveyor_8x4_03_Steel
    Wall_Conveyor_8x4_01
    Wall_Conveyor_8x4_02
    Wall_Conveyor_8x4_03
    ConveyorPoleWall
    QuarterPipe
    QuarterPipe_02
    QuarterPipeCorner_01
    QuarterPipeCorner_02
    Ramp_Diagonal_8x1_01
    Ramp_Diagonal_8x1_02
    Ramp_Diagonal_8x2_01
    Ramp_Diagonal_8x2_02
    Ramp_Diagonal_8x4_01
    Ramp_Diagonal_8x4_02
    Wall_Door_8x4_01_Steel
    Wall_Door_8x4_02_Steel
    Wall_Door_8x4_03_Steel
    Wall_Door_8x4_01
    Wall_Door_8x4_02
    Wall_Door_8x4_03
    Wall_Gate_8x4_01
    PillarBase
    PillarMiddle
    PillarTop
    Ramp_8x4_Inverted_01
    Ramp_8x8x8
    Foundation_Frame_01
    FoundationGlass_01
    PipelineSupportWall
    PipelineSupportWallHole
    Stairs_Left_01
    Stairs_Right_01
    WalkwayCross
    WalkwayRamp
    WalkwayStraight
    WalkwayT
    WalkwayTurn
    PowerPoleWall
    PowerPoleWallDouble
    PowerPoleWallDoubleMk3
    PowerPoleWallMk3
    Wall_Window_8x4_01
    Wall_Window_8x4_02
    Wall_Window_8x4_04
    Biofuel
    GenericBiomass
    Leaves
    Wood
    Fabric
    Mycelia
    LiquidBiofuel
    PackagedBiofuel
    HogParts
    SpitterParts
    FlowerPetals
    Chainsaw
    GolfCart
    HazmatSuit
    JetPack
    JumpingStilts
    RebarGunProjectile
    Rifle
    ShockShank
    StunSpear
    PortableMiner
    ObjectScanner
    Gasmask
    ColorGun
    NobeliskDetonator
    Water
    OreIron
    OreCopper
    Stone
    Coal
    LiquidOil
    OreBauxite
    OreGold
    OreUranium
    RawQuartz
    Sulfur
    UraniumCell
    UraniumPellet
    CompactedCoal
    PackagedOil
    PackagedWater
    NuclearFuelRod
    Truck
    FreightWagon
    Locomotive
    Tractor
    Explorer
    CyberWagon
    Beacon
    Berry
    Shroom
    Nut
    Medkit
    Parachute  
  }

  enum BeltEnum {
    InvalidBelt
    ConveyorBeltMk1
    ConveyorBeltMk5
    ConveyorBeltMk2
    ConveyorBeltMk3
    ConveyorBeltMk4  
  }

  enum PipeEnum {
    InvalidPipe
    Pipeline  
  }

  type Recipe {
    name: String!
    displayName: String!
    manufacturingDuration: Float!
    manufacturingMultiplier: Float!
    ingredients: [ResourcePacket]
    product: [ResourcePacket]
    producedIn: [SatisGraphtoryNodeEnum]
    enumValue: RecipeEnum
  }

  type ResourcePacket {
    resource: ItemEnum!
    amount: Int!
  }

  type ResourceForm {
    name: String!
    enumValue: ResourceFormEnum
  }

  type Resource {
    name: String!
    displayName: String!
    description: String!
    resourceForm: ResourceFormEnum!
    sinkPoints: Int!
    energyValue: Float!
    enumValue: ResourceEnum
  }

  type Item {
    name: String!
    displayName: String!
    description: String!
    resourceForm: ResourceFormEnum!
    sinkPoints: Int!
    energyValue: Float!
    dataClass: String!
    enumValue: ItemEnum
  }

  type Belt {
    name: String!
    displayName: String!
    description: String!
    speed: Float!
    enumValue: BeltEnum
  }

  type Pipe {
    name: String!
    displayName: String!
    description: String!
    flowLimit: Float!
    enumValue: PipeEnum
  }

  type ExtractorMachine {
    allowedResourceForms: [ResourceForm!]!
    allowedResources: [ItemEnum]
    cycleTime: Float!
    itemsPerCycle: Int!
    enumValue: SatisGraphtoryNodeEnum
    powerConsumption: Float!
    powerConsumptionExponent: Float!
    minimumProducingTime: Float!
    minimumStoppedTime: Float!
    name: String!
    displayName: String!
    description: String!
    minPotential: Float!
    maxPotential: Float!
    maxPotentialIncreasePerCrystal: Float!
  }

  type BeltAttachmentMachine {
    enumValue: SatisGraphtoryNodeEnum
    name: String!
    displayName: String!
    description: String!
    minPotential: Float!
    maxPotential: Float!
    maxPotentialIncreasePerCrystal: Float!
  }

  type PipeAttachmentMachine {
    enumValue: SatisGraphtoryNodeEnum
    name: String!
    displayName: String!
    description: String!
    minPotential: Float!
    maxPotential: Float!
    maxPotentialIncreasePerCrystal: Float!
  }

  type FluidStorageMachine {
    storageCapacity: Float!
    enumValue: SatisGraphtoryNodeEnum
    name: String!
    displayName: String!
    description: String!
    minPotential: Float!
    maxPotential: Float!
    maxPotentialIncreasePerCrystal: Float!
  }

  type ManufacturerMachine {
    manufacturingSpeed: Float!
    enumValue: SatisGraphtoryNodeEnum
    powerConsumption: Float!
    powerConsumptionExponent: Float!
    minimumProducingTime: Float!
    minimumStoppedTime: Float!
    name: String!
    displayName: String!
    description: String!
    minPotential: Float!
    maxPotential: Float!
    maxPotentialIncreasePerCrystal: Float!
  }

  type SolidStorageMachine {
    enumValue: SatisGraphtoryNodeEnum
    name: String!
    displayName: String!
    description: String!
    minPotential: Float!
    maxPotential: Float!
    maxPotentialIncreasePerCrystal: Float!
  }
`;
export default generatedTypeDefs;
