/** 十天干 */
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'

/** 十二地支 */
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

/** 五行 */
export type WuXing = '金' | '木' | '水' | '火' | '土'

/** 八卦 */
export type BaGua = '乾' | '兑' | '离' | '震' | '巽' | '坎' | '艮' | '坤'

/** 卦宫 */
export type GuaGong = BaGua

/** 爻的阴阳状态 */
export type YaoType = '少阳' | '少阴' | '老阳' | '老阴'

/** 六亲 */
export type LiuQin = '父母' | '兄弟' | '官鬼' | '妻财' | '子孙'

/** 六神 */
export type LiuShen = '青龙' | '朱雀' | '勾陈' | '腾蛇' | '白虎' | '玄武'

/** 神煞 */
export type ShenShaType = '天乙贵人' | '驿马' | '桃花' | '劫煞' | '亡神' | '禄神' | '羊刃' | '文昌' | '华盖'
  | '天马' | '天喜' | '皇恩' | '天德' | '月德' | '将星' | '谋星' | '天医' | '灾煞'
  | '世身' | '卦身' | '胎爻' | '香闺' | '床帐'

/** 旺相休囚死 */
export type WangShuai = '旺' | '相' | '休' | '囚' | '死'

/** 伏神信息 */
export interface FuShen {
  /** 伏神六亲 */
  liuqin: LiuQin
  /** 伏神天干 */
  gan: TianGan
  /** 伏神地支 */
  zhi: DiZhi
  /** 伏神五行 */
  wuxing: WuXing
}

/** 单个爻 */
export interface Yao {
  /** 阴阳: true=阳, false=阴 */
  yang: boolean
  /** 是否变爻 */
  changing: boolean
  /** 爻类型 */
  type: YaoType
}

/** 纳甲干支 */
export interface Najia {
  gan: TianGan
  zhi: DiZhi
}

/** 单个爻位的完整排盘信息 */
export interface YaoDetail {
  /** 爻位: 初, 二, 三, 四, 五, 上 */
  position: number
  /** 爻象 */
  yao: Yao
  /** 纳甲干支 */
  najia: Najia
  /** 五行 */
  wuxing: WuXing
  /** 六亲 */
  liuqin: LiuQin
  /** 六神 */
  liushou: LiuShen
  /** 是否世爻 */
  isShi: boolean
  /** 是否应爻 */
  isYing: boolean
  /** 是否空亡 */
  isEmpty: boolean
  /** 神煞列表 */
  shensha: ShenShaType[]
  /** 伏神 */
  fushen?: FuShen
  /** 月建旺衰 */
  wangshuai?: WangShuai
  /** 是否暗动（含月破/日破） */
  isAnDong?: boolean
  /** 暗动原因 */
  anDongReason?: '月冲' | '日冲' | '月破' | '日破'
  /** 是否日破（变卦专用，六冲日辰） */
  isRiPo?: boolean
  /** 日破原因 */
  riPoReason?: string
}

/** 四柱中的一柱 */
export interface Zhu {
  gan: TianGan
  zhi: DiZhi
  wuxing: WuXing
}

/** 八字 */
export interface BaZi {
  nian: Zhu
  yue: Zhu
  ri: Zhu
  shi: Zhu
}

/** 完整卦象 */
export interface GuaDetail {
  /** 卦名 */
  name: string
  /** 卦序编号 (1-64) */
  index: number
  /** 上卦 */
  upper: BaGua
  /** 下卦 */
  lower: BaGua
  /** 卦宫 */
  gong: GuaGong
  /** 在宫中的位置 (0纯卦 1一世 2二世 3三世 4四世 5五世 6游魂 7归魂) */
  palacePos: number
  /** 卦宫五行 */
  gongWuxing: WuXing
  /** 卦辞 */
  guaci: string
  /** 爻辞，从初爻到上爻 */
  yaoci: string[]
  /** 六个爻的完整信息，从初爻(0)到上爻(5) */
  yaos: YaoDetail[]
  /** 世爻位置 (1-6) */
  shiPosition: number
  /** 应爻位置 (1-6) */
  yingPosition: number
  /** 彖传 */
  tuancizhuan?: string
  /** 大象传 */
  xiangzhuan?: string
  /** 小象传，每爻一条 */
  yaoxiang?: string[]
}

/** 三合局结果 */
export interface SanHeResult {
  /** 三合局名称，如"申子辰合水局" */
  name: string
  /** 五行 */
  wuxing: WuXing
  /** 是否已形成完整三合局 */
  completed: boolean
  /** 三合局的三个地支 */
  zhis: DiZhi[]
  /** 已匹配到的地支 */
  matchedZhis: DiZhi[]
  /** 缺失的地支（未完成时） */
  missingZhis: DiZhi[]
  /** 来源明细 */
  sources: { zhi: DiZhi; source: string }[]
}

/** 反吟伏吟 */
export interface FanYinFuYin {
  type: '反吟' | '伏吟'
  description: string
}

/** 空亡信息 */
export interface KongWang {
  /** 所属旬 */
  xun: string
  /** 空亡的两个地支 */
  zhi1: DiZhi
  zhi2: DiZhi
}

/** 神煞标注（按爻位） */
export interface ShenShaMark {
  position: number
  type: ShenShaType
}

/** 起卦方式 */
export type DivinationMethod =
  | 'coin'
  | 'manual'
  | 'auto'
  | 'time'
  | 'number'
  | 'character'
  | 'hexagram'

/** 备注对象 */
export interface PaipanNote {
  /** 占卜问题 */
  question: string
  /** 占卜结果记录 */
  result: string
  /** 快速标签 */
  tags: string[]
}

/** 完整排盘结果 */
export interface PaipanResult {
  /** 唯一标识 */
  id: string
  /** 起卦时间 */
  timestamp: Date
  /** 四柱八字 */
  bazi: BaZi
  /** 本卦 */
  original: GuaDetail
  /** 变卦（如果有动爻） */
  changed?: GuaDetail
  /** 空亡 */
  kongwang: KongWang
  /** 三合局（可选，含完整局和未完成局） */
  sanhe?: SanHeResult[]
  /** 反吟伏吟（可选） */
  fanyin?: FanYinFuYin
  /** 起卦方式（可选，向后兼容旧数据） */
  method?: DivinationMethod
  /** 备注 */
  note?: PaipanNote
}

/** 显示开关配置 */
export interface DisplayOptions {
  showSanhe: boolean
  showGuaci: boolean
  showFanyin: boolean
  showShensha: boolean
  showKongwang: boolean
  showFuShen: boolean
  showWangShuai: boolean
  showAnDong: boolean
}
