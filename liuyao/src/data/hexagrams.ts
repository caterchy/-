import type { BaGua, GuaGong } from '../types'

/** 六十四卦数据（按八宫排列） */
export interface HexagramInfo {
  /** 卦名 */
  name: string
  /** 二进制编码, 从下到上, 阳=1 阴=0, 6位 */
  code: string
  /** 上卦 */
  upper: BaGua
  /** 下卦 */
  lower: BaGua
  /** 卦宫 */
  palace: GuaGong
  /** 在宫中的位置: 0纯卦 1一世 2二世 3三世 4四世 5五世 6游魂 7归魂 */
  palacePos: number
  /** 卦辞 */
  guaci: string
  /** 爻辞, 从初爻到上爻 */
  yaoci: string[]
}

/** 八卦二进制编码(上/下三爻, 从下到上) */
export const TRIGRAM_TO_BIN: Record<BaGua, string> = {
  '乾': '111',
  '兑': '110',
  '离': '101',
  '震': '100',
  '巽': '011',
  '坎': '010',
  '艮': '001',
  '坤': '000',
}

/** 二进制到八卦的映射 */
const BIN_TO_TRIGRAM: Record<string, BaGua> = {}
for (const [k, v] of Object.entries(TRIGRAM_TO_BIN)) {
  BIN_TO_TRIGRAM[v] = k as BaGua
}

/** 根据上下八卦得到六位二进制码 */
export function getHexagramCode(upper: BaGua, lower: BaGua): string {
  return TRIGRAM_TO_BIN[upper] + TRIGRAM_TO_BIN[lower]
}

/** 从六位二进制码解析上下卦 */
export function parseHexagramCode(code: string): { upper: BaGua; lower: BaGua } {
  return {
    upper: BIN_TO_TRIGRAM[code.slice(0, 3)],
    lower: BIN_TO_TRIGRAM[code.slice(3, 6)],
  }
}

// prettier-ignore
const ALL_HEXAGRAMS: HexagramInfo[] = [
  // ===== 乾宫 =====
  { name: '乾为天', code: '111111', upper: '乾', lower: '乾', palace: '乾', palacePos: 0,
    guaci: '元亨利贞。',
    yaoci: ['潜龙勿用。', '见龙在田，利见大人。', '君子终日乾乾，夕惕若厉，无咎。', '或跃在渊，无咎。', '飞龙在天，利见大人。', '亢龙有悔。'] },
  { name: '天风姤', code: '111110', upper: '乾', lower: '巽', palace: '乾', palacePos: 1,
    guaci: '女壮，勿用取女。',
    yaoci: ['系于金柅，贞吉。', '包有鱼，无咎。', '臀无肤，其行次且，厉，无大咎。', '包无鱼，起凶。', '以杞包瓜，含章，有陨自天。', '姤其角，吝，无咎。'] },
  { name: '天山遁', code: '111001', upper: '乾', lower: '艮', palace: '乾', palacePos: 2,
    guaci: '亨，小利贞。',
    yaoci: ['遁尾，厉，勿用有攸往。', '执之用黄牛之革，莫之胜说。', '系遁，有疾厉，畜臣妾吉。', '好遁，君子吉，小人否。', '嘉遁，贞吉。', '肥遁，无不利。'] },
  { name: '天地否', code: '111000', upper: '乾', lower: '坤', palace: '乾', palacePos: 3,
    guaci: '否之匪人，不利君子贞，大往小来。',
    yaoci: ['拔茅茹，以其汇，贞吉亨。', '包承，小人吉，大人否亨。', '包羞。', '有命无咎，畴离祉。', '休否，大人吉。', '倾否，先否后喜。'] },
  { name: '风地观', code: '011000', upper: '巽', lower: '坤', palace: '乾', palacePos: 4,
    guaci: '盥而不荐，有孚颙若。',
    yaoci: ['童观，小人无咎，君子吝。', '窥观，利女贞。', '观我生，进退。', '观国之光，利用宾于王。', '观我生，君子无咎。', '观其生，君子无咎。'] },
  { name: '山地剥', code: '001000', upper: '艮', lower: '坤', palace: '乾', palacePos: 5,
    guaci: '不利有攸往。',
    yaoci: ['剥床以足，蔑贞凶。', '剥床以辨，蔑贞凶。', '剥之，无咎。', '剥床以肤，凶。', '贯鱼以宫人宠，无不利。', '硕果不食，君子得舆，小人剥庐。'] },
  { name: '火地晋', code: '101000', upper: '离', lower: '坤', palace: '乾', palacePos: 6,
    guaci: '康侯用锡马蕃庶，昼日三接。',
    yaoci: ['晋如摧如，贞吉。', '晋如愁如，贞吉。', '众允，悔亡。', '晋如鼫鼠，贞厉。', '悔亡，失得勿恤。', '晋其角，维用伐邑，厉吉无咎。'] },
  { name: '火天大有', code: '101111', upper: '离', lower: '乾', palace: '乾', palacePos: 7,
    guaci: '元亨。',
    yaoci: ['无交害，匪咎，艰则无咎。', '大车以载，有攸往，无咎。', '公用亨于天子，小人弗克。', '匪其彭，无咎。', '厥孚交如，威如，吉。', '自天佑之，吉无不利。'] },

  // ===== 兑宫 =====
  { name: '兑为泽', code: '110110', upper: '兑', lower: '兑', palace: '兑', palacePos: 0,
    guaci: '亨，利贞。',
    yaoci: ['和兑，吉。', '孚兑，吉，悔亡。', '来兑，凶。', '商兑未宁，介疾有喜。', '孚于剥，有厉。', '引兑。'] },
  { name: '泽水困', code: '110010', upper: '兑', lower: '坎', palace: '兑', palacePos: 1,
    guaci: '亨，贞，大人吉，无咎。',
    yaoci: ['臀困于株木，入于幽谷，三岁不觌。', '困于酒食，朱绂方来。', '困于石，据于蒺藜。', '来徐徐，困于金车，吝，有终。', '劓刖，困于赤绂。', '困于葛藟，于臲卼。'] },
  { name: '泽地萃', code: '110000', upper: '兑', lower: '坤', palace: '兑', palacePos: 2,
    guaci: '亨，王假有庙。',
    yaoci: ['有孚不终，乃乱乃萃。', '引吉，无咎。', '萃如嗟如，无攸利。', '大吉，无咎。', '萃有位，无咎。', '赍咨涕洟，无咎。'] },
  { name: '泽山咸', code: '110001', upper: '兑', lower: '艮', palace: '兑', palacePos: 3,
    guaci: '亨，利贞，取女吉。',
    yaoci: ['咸其拇。', '咸其腓，凶，居吉。', '咸其股，执其随，往吝。', '贞吉悔亡，憧憧往来。', '咸其脢，无悔。', '咸其辅颊舌。'] },
  { name: '水山蹇', code: '010001', upper: '坎', lower: '艮', palace: '兑', palacePos: 4,
    guaci: '利西南，不利东北。',
    yaoci: ['往蹇来誉。', '王臣蹇蹇，匪躬之故。', '往蹇来反。', '往蹇来连。', '大蹇朋来。', '往蹇来硕，吉。'] },
  { name: '地山谦', code: '000001', upper: '坤', lower: '艮', palace: '兑', palacePos: 5,
    guaci: '亨，君子有终。',
    yaoci: ['谦谦君子，用涉大川，吉。', '鸣谦，贞吉。', '劳谦君子，有终吉。', '无不利，撝谦。', '不富以其邻，利用侵伐，无不利。', '鸣谦，利用行师，征邑国。'] },
  { name: '雷山小过', code: '100001', upper: '震', lower: '艮', palace: '兑', palacePos: 6,
    guaci: '亨，利贞，可小事不可大事。',
    yaoci: ['飞鸟以凶。', '过其祖，遇其妣。', '弗过防之，从或戕之。', '无咎，弗过遇之。', '密云不雨，自我西郊。', '弗遇过之，飞鸟离之。'] },
  { name: '雷泽归妹', code: '100110', upper: '震', lower: '兑', palace: '兑', palacePos: 7,
    guaci: '征凶，无攸利。',
    yaoci: ['归妹以娣，跛能履，征吉。', '眇能视，利幽人之贞。', '归妹以须，反归以娣。', '归妹愆期，迟归有时。', '帝乙归妹，其君之袂。', '女承筐无实，士刲羊无血。'] },

  // ===== 离宫 =====
  { name: '离为火', code: '101101', upper: '离', lower: '离', palace: '离', palacePos: 0,
    guaci: '利贞，亨。',
    yaoci: ['履错然，敬之无咎。', '黄离，元吉。', '日昃之离，不鼓缶而歌。', '突如其来如，焚如，死如，弃如。', '出涕沱若，戚嗟若，吉。', '王用出征，有嘉折首。'] },
  { name: '火山旅', code: '101001', upper: '离', lower: '艮', palace: '离', palacePos: 1,
    guaci: '小亨，旅贞吉。',
    yaoci: ['旅琐琐，斯其所取灾。', '旅即次，怀其资，得童仆贞。', '旅焚其次，丧其童仆。', '旅于处，得其资斧。', '射雉一矢亡，终以誉命。', '鸟焚其巢，旅人先笑后号咷。'] },
  { name: '火风鼎', code: '101011', upper: '离', lower: '巽', palace: '离', palacePos: 2,
    guaci: '元吉，亨。',
    yaoci: ['鼎颠趾，利出否。', '鼎有实，我仇有疾。', '鼎耳革，其行塞。', '鼎折足，覆公餗。', '鼎黄耳金铉，利贞。', '鼎玉铉，大吉，无不利。'] },
  { name: '火水未济', code: '101010', upper: '离', lower: '坎', palace: '离', palacePos: 3,
    guaci: '亨，小狐汔济，濡其尾，无攸利。',
    yaoci: ['濡其尾，吝。', '曳其轮，贞吉。', '未济，征凶。', '贞吉悔亡，震用伐鬼方。', '贞吉，无悔。', '有孚于饮酒，濡其首。'] },
  { name: '山水蒙', code: '001011', upper: '艮', lower: '坎', palace: '离', palacePos: 4,
    guaci: '亨。匪我求童蒙，童蒙求我。',
    yaoci: ['发蒙，利用刑人。', '包蒙，吉。', '勿用取女，见金夫。', '困蒙，吝。', '童蒙，吉。', '击蒙，不利为寇，利御寇。'] },
  { name: '风水涣', code: '011010', upper: '巽', lower: '坎', palace: '离', palacePos: 5,
    guaci: '亨，王假有庙，利涉大川。',
    yaoci: ['用拯马壮，吉。', '涣奔其机，悔亡。', '涣其躬，无悔。', '涣其群，元吉。', '涣汗其大号，涣王居。', '涣其血，去逖出。'] },
  { name: '天水讼', code: '111010', upper: '乾', lower: '坎', palace: '离', palacePos: 6,
    guaci: '有孚窒惕，中吉，终凶。',
    yaoci: ['不永所事，小有言，终吉。', '不克讼，归而逋。', '食旧德，贞厉，终吉。', '不克讼，复即命，渝安贞。', '讼元吉。', '或锡之鞶带，终朝三褫之。'] },
  { name: '天火同人', code: '111101', upper: '乾', lower: '离', palace: '离', palacePos: 7,
    guaci: '同人于野，亨。',
    yaoci: ['同人于门，无咎。', '同人于宗，吝。', '伏戎于莽，升其高陵。', '乘其墉，弗克攻，吉。', '同人先号咷而后笑，大师克相遇。', '同人于郊，无悔。'] },

  // ===== 震宫 =====
  { name: '震为雷', code: '100100', upper: '震', lower: '震', palace: '震', palacePos: 0,
    guaci: '亨。震来虩虩，笑言哑哑。',
    yaoci: ['震来虩虩，后笑言哑哑，吉。', '震来厉，亿丧贝。', '震苏苏，震行无眚。', '震遂泥。', '震往来厉，亿无丧。', '震索索，视矍矍，征凶。'] },
  { name: '雷地豫', code: '100000', upper: '震', lower: '坤', palace: '震', palacePos: 1,
    guaci: '利建侯行师。',
    yaoci: ['鸣豫，凶。', '介于石，不终日，贞吉。', '盱豫，悔。', '由豫，大有得。', '贞疾，恒不死。', '冥豫，成有渝，无咎。'] },
  { name: '雷水解', code: '100010', upper: '震', lower: '坎', palace: '震', palacePos: 2,
    guaci: '利西南，无所往。',
    yaoci: ['无咎。', '田获三狐，得黄矢。', '负且乘，致寇至。', '解而拇，朋至斯孚。', '君子维有解，吉。', '公用射隼于高墉之上。'] },
  { name: '雷风恒', code: '100011', upper: '震', lower: '巽', palace: '震', palacePos: 3,
    guaci: '亨，无咎，利贞。',
    yaoci: ['浚恒，贞凶，无攸利。', '悔亡。', '不恒其德，或承之羞。', '田无禽。', '恒其德，贞。', '振恒，凶。'] },
  { name: '地风升', code: '000011', upper: '坤', lower: '巽', palace: '震', palacePos: 4,
    guaci: '元亨，用见大人。',
    yaoci: ['允升，大吉。', '孚乃利用禴，无咎。', '升虚邑。', '王用亨于岐山，吉。', '贞吉，升阶。', '冥升，利于不息之贞。'] },
  { name: '水风井', code: '010011', upper: '坎', lower: '巽', palace: '震', palacePos: 5,
    guaci: '改邑不改井，无丧无得。',
    yaoci: ['井泥不食，旧井无禽。', '井谷射鲋，瓮敝漏。', '井渫不食，为我心恻。', '井甃，无咎。', '井洌，寒泉食。', '井收勿幕，有孚元吉。'] },
  { name: '泽风大过', code: '110011', upper: '兑', lower: '巽', palace: '震', palacePos: 6,
    guaci: '栋桡，利有攸往，亨。',
    yaoci: ['藉用白茅，无咎。', '枯杨生稊，老夫得其女妻。', '栋桡，凶。', '栋隆，吉。', '枯杨生华，老妇得其士夫。', '过涉灭顶，凶。'] },
  { name: '泽雷随', code: '110100', upper: '兑', lower: '震', palace: '震', palacePos: 7,
    guaci: '元亨，利贞，无咎。',
    yaoci: ['官有渝，贞吉。', '系小子，失丈夫。', '系丈夫，失小子。', '随有获，贞凶。', '孚于嘉，吉。', '拘系之，乃从维之。'] },

  // ===== 巽宫 =====
  { name: '巽为风', code: '011011', upper: '巽', lower: '巽', palace: '巽', palacePos: 0,
    guaci: '小亨，利有攸往，利见大人。',
    yaoci: ['进退，利武人之贞。', '巽在床下，用史巫纷若。', '频巽，吝。', '悔亡，田获三品。', '贞吉，悔亡，无不利。', '巽在床下，丧其资斧。'] },
  { name: '风天小畜', code: '011111', upper: '巽', lower: '乾', palace: '巽', palacePos: 1,
    guaci: '亨。密云不雨，自我西郊。',
    yaoci: ['复自道，何其咎，吉。', '牵复，吉。', '舆说辐，夫妻反目。', '有孚，血去惕出，无咎。', '有孚挛如，富以其邻。', '既雨既处，尚德载。'] },
  { name: '风火家人', code: '011101', upper: '巽', lower: '离', palace: '巽', palacePos: 2,
    guaci: '利女贞。',
    yaoci: ['闲有家，悔亡。', '无攸遂，在中馈。', '家人嗃嗃，悔厉吉。', '富家，大吉。', '王假有家，勿恤吉。', '有孚威如，终吉。'] },
  { name: '风雷益', code: '011100', upper: '巽', lower: '震', palace: '巽', palacePos: 3,
    guaci: '利有攸往，利涉大川。',
    yaoci: ['利用为大作，元吉。', '或益之十朋之龟。', '益之用凶事，无咎。', '中行告公从，利用为依迁国。', '有孚惠心，勿问元吉。', '莫益之，或击之。'] },
  { name: '天雷无妄', code: '111100', upper: '乾', lower: '震', palace: '巽', palacePos: 4,
    guaci: '元亨，利贞。其匪正有眚。',
    yaoci: ['无妄往，吉。', '不耕获，不菑畬。', '无妄之灾，或系之牛。', '可贞，无咎。', '无妄之疾，勿药有喜。', '无妄行，有眚，无攸利。'] },
  { name: '火雷噬嗑', code: '101100', upper: '离', lower: '震', palace: '巽', palacePos: 5,
    guaci: '亨，利用狱。',
    yaoci: ['屦校灭趾，无咎。', '噬肤灭鼻，无咎。', '噬腊肉，遇毒。', '噬干胏，得金矢。', '噬干肉，得黄金。', '何校灭耳，凶。'] },
  { name: '山雷颐', code: '001100', upper: '艮', lower: '震', palace: '巽', palacePos: 6,
    guaci: '贞吉。观颐，自求口实。',
    yaoci: ['舍尔灵龟，观我朵颐。', '颠颐，拂经于丘。', '拂颐，贞凶。', '颠颐，吉。', '拂经，居贞吉。', '由颐，厉吉。'] },
  { name: '山风蛊', code: '001011', upper: '艮', lower: '巽', palace: '巽', palacePos: 7,
    guaci: '元亨，利涉大川。',
    yaoci: ['干父之蛊，有子考无咎。', '干母之蛊，不可贞。', '干父之蛊，小有悔。', '裕父之蛊，往见吝。', '干父之蛊，用誉。', '不事王侯，高尚其事。'] },

  // ===== 坎宫 =====
  { name: '坎为水', code: '010010', upper: '坎', lower: '坎', palace: '坎', palacePos: 0,
    guaci: '习坎，有孚维心亨。',
    yaoci: ['习坎，入于坎窞。', '坎有险，求小得。', '来之坎坎，险且枕。', '樽酒簋贰，用缶。', '坎不盈，祇既平。', '上六失道，凶三岁。'] },
  { name: '水泽节', code: '010110', upper: '坎', lower: '兑', palace: '坎', palacePos: 1,
    guaci: '亨，苦节不可贞。',
    yaoci: ['不出户庭，无咎。', '不出门庭，凶。', '不节若，则嗟若。', '安节，亨。', '甘节，吉。', '苦节，贞凶。'] },
  { name: '水雷屯', code: '010100', upper: '坎', lower: '震', palace: '坎', palacePos: 2,
    guaci: '元亨利贞，勿用有攸往。',
    yaoci: ['磐桓，利居贞。', '屯如邅如，乘马班如。', '即鹿无虞，惟入于林中。', '乘马班如，求婚媾。', '屯其膏，小贞吉。', '乘马班如，泣血涟如。'] },
  { name: '水火既济', code: '010101', upper: '坎', lower: '离', palace: '坎', palacePos: 3,
    guaci: '亨小，利贞，初吉终乱。',
    yaoci: ['曳其轮，濡其尾。', '妇丧其茀，勿逐。', '高宗伐鬼方，三年克之。', '繻有衣袽，终日戒。', '东邻杀牛，不如西邻之禴祭。', '濡其首，厉。'] },
  { name: '泽火革', code: '110101', upper: '兑', lower: '离', palace: '坎', palacePos: 4,
    guaci: '巳日乃孚，元亨利贞。',
    yaoci: ['巩用黄牛之革。', '巳日乃革之。', '征凶，贞厉。', '悔亡，有孚改命。', '大人虎变，未占有孚。', '君子豹变，小人革面。'] },
  { name: '雷火丰', code: '100101', upper: '震', lower: '离', palace: '坎', palacePos: 5,
    guaci: '亨，王假之，勿忧。',
    yaoci: ['遇其配主，虽旬无咎。', '丰其蔀，日中见斗。', '丰其沛，日中见沬。', '丰其蔀，日中见斗。', '来章有庆誉，吉。', '丰其屋，蔀其家。'] },
  { name: '地火明夷', code: '000101', upper: '坤', lower: '离', palace: '坎', palacePos: 6,
    guaci: '利艰贞。',
    yaoci: ['明夷于飞，垂其翼。', '明夷，夷于左股。', '明夷于南狩，得其大首。', '入于左腹，获明夷之心。', '箕子之明夷，利贞。', '不明晦，初登于天。'] },
  { name: '地水师', code: '000010', upper: '坤', lower: '坎', palace: '坎', palacePos: 7,
    guaci: '贞，丈人吉，无咎。',
    yaoci: ['师出以律，否臧凶。', '在师中，吉。', '师或舆尸，凶。', '师左次，无咎。', '田有禽，利执言。', '大君有命，开国承家。'] },

  // ===== 艮宫 =====
  { name: '艮为山', code: '001001', upper: '艮', lower: '艮', palace: '艮', palacePos: 0,
    guaci: '艮其背，不获其身。',
    yaoci: ['艮其趾，无咎。', '艮其腓，不拯其随。', '艮其限，列其夤。', '艮其身，无咎。', '艮其辅，言有序。', '敦艮，吉。'] },
  { name: '山火贲', code: '001101', upper: '艮', lower: '离', palace: '艮', palacePos: 1,
    guaci: '亨，小利有攸往。',
    yaoci: ['贲其趾，舍车而徒。', '贲其须。', '贲如濡如，永贞吉。', '贲如皤如，白马翰如。', '贲于丘园，束帛戋戋。', '白贲，无咎。'] },
  { name: '山天大畜', code: '001111', upper: '艮', lower: '乾', palace: '艮', palacePos: 2,
    guaci: '利贞，不家食吉。',
    yaoci: ['有厉，利已。', '舆说輹。', '良马逐，利艰贞。', '童牛之牿，元吉。', '豮豕之牙，吉。', '何天之衢，亨。'] },
  { name: '山泽损', code: '001110', upper: '艮', lower: '兑', palace: '艮', palacePos: 3,
    guaci: '有孚，元吉，无咎。',
    yaoci: ['已事遄往，无咎。', '利贞，征凶。', '三人行，则损一人。', '损其疾，使遄有喜。', '或益之十朋之龟。', '弗损益之，无咎。'] },
  { name: '火泽睽', code: '101110', upper: '离', lower: '兑', palace: '艮', palacePos: 4,
    guaci: '小事吉。',
    yaoci: ['悔亡，丧马勿逐。', '遇主于巷，无咎。', '见舆曳，其牛掣。', '睽孤，遇元夫。', '悔亡，厥宗噬肤。', '睽孤，豕负涂。'] },
  { name: '天泽履', code: '111110', upper: '乾', lower: '兑', palace: '艮', palacePos: 5,
    guaci: '履虎尾，不咥人，亨。',
    yaoci: ['素履往，无咎。', '履道坦坦，幽人贞吉。', '眇能视，跛能履。', '履虎尾，愬愬终吉。', '夬履，贞厉。', '视履考祥，其旋元吉。'] },
  { name: '风泽中孚', code: '011110', upper: '巽', lower: '兑', palace: '艮', palacePos: 6,
    guaci: '豚鱼吉，利涉大川。',
    yaoci: ['虞吉，有它不燕。', '鹤鸣在阴，其子和之。', '得敌，或鼓或罢。', '月几望，马匹亡。', '有孚挛如，无咎。', '翰音登于天，贞凶。'] },
  { name: '风山渐', code: '011001', upper: '巽', lower: '艮', palace: '艮', palacePos: 7,
    guaci: '女归吉，利贞。',
    yaoci: ['鸿渐于干，小子厉。', '鸿渐于磐，饮食衎衎。', '鸿渐于陆，夫征不复。', '鸿渐于木，或得其桷。', '鸿渐于陵，妇三岁不孕。', '鸿渐于逵，其羽可用为仪。'] },

  // ===== 坤宫 =====
  { name: '坤为地', code: '000000', upper: '坤', lower: '坤', palace: '坤', palacePos: 0,
    guaci: '元亨，利牝马之贞。',
    yaoci: ['履霜，坚冰至。', '直方大，不习无不利。', '含章可贞，或从王事。', '括囊，无咎无誉。', '黄裳，元吉。', '龙战于野，其血玄黄。'] },
  { name: '地雷复', code: '000100', upper: '坤', lower: '震', palace: '坤', palacePos: 1,
    guaci: '亨。出入无疾，朋来无咎。',
    yaoci: ['不远复，无祗悔。', '休复，吉。', '频复，厉无咎。', '中行独复。', '敦复，无悔。', '迷复，凶，有灾眚。'] },
  { name: '地泽临', code: '000110', upper: '坤', lower: '兑', palace: '坤', palacePos: 2,
    guaci: '元亨利贞。至于八月有凶。',
    yaoci: ['咸临，贞吉。', '咸临，吉无不利。', '甘临，无攸利。', '至临，无咎。', '知临，大君之宜。', '敦临，吉无咎。'] },
  { name: '地天泰', code: '000111', upper: '坤', lower: '乾', palace: '坤', palacePos: 3,
    guaci: '小往大来，吉亨。',
    yaoci: ['拔茅茹，以其汇，征吉。', '包荒，用冯河。', '无平不陂，无往不复。', '翩翩，不富以其邻。', '帝乙归妹，以祉元吉。', '城复于隍，勿用师。'] },
  { name: '雷天大壮', code: '100111', upper: '震', lower: '乾', palace: '坤', palacePos: 4,
    guaci: '利贞。',
    yaoci: ['壮于趾，征凶。', '贞吉。', '小人用壮，君子用罔。', '贞吉悔亡，藩决不赢。', '丧羊于易，无悔。', '羝羊触藩，不能退。'] },
  { name: '泽天夬', code: '110111', upper: '兑', lower: '乾', palace: '坤', palacePos: 5,
    guaci: '扬于王庭，孚号有厉。',
    yaoci: ['壮于前趾，往不胜。', '惕号，莫夜有戎。', '壮于頄，有凶。', '臀无肤，其行次且。', '苋陆夬夬，中行无咎。', '无号，终有凶。'] },
  { name: '水天需', code: '010111', upper: '坎', lower: '乾', palace: '坤', palacePos: 6,
    guaci: '有孚，光亨，贞吉。',
    yaoci: ['需于郊，利用恒。', '需于沙，小有言。', '需于泥，致寇至。', '需于血，出自穴。', '需于酒食，贞吉。', '入于穴，有不速之客三人来。'] },
  { name: '水地比', code: '010000', upper: '坎', lower: '坤', palace: '坤', palacePos: 7,
    guaci: '吉。原筮元永贞，无咎。',
    yaoci: ['有孚比之，无咎。', '比之自内，贞吉。', '比之匪人。', '外比之，贞吉。', '显比，王用三驱。', '比之无首，凶。'] },
]

/** 按二进制编码索引 */
const HEXAGRAM_MAP = new Map<string, HexagramInfo>()
for (const h of ALL_HEXAGRAMS) {
  HEXAGRAM_MAP.set(h.code, h)
}

/** 通过二进制编码查找卦 */
export function findHexagramByCode(code: string): HexagramInfo | undefined {
  return HEXAGRAM_MAP.get(code)
}

/** 通过卦名查找卦 */
export function findHexagramByName(name: string): HexagramInfo | undefined {
  return ALL_HEXAGRAMS.find(h => h.name === name)
}

/** 获取某宫的所有卦 */
export function getHexagramsByPalace(palace: GuaGong): HexagramInfo[] {
  return ALL_HEXAGRAMS.filter(h => h.palace === palace)
}

export { ALL_HEXAGRAMS }
