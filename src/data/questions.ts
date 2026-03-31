import { Question } from '../types';
import { LOCATION_DATA, LocationInfo } from './locationData';

const shuffle = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getDistractors = (target: LocationInfo, all: LocationInfo[]): string[] => {
  // Use a map to ensure we only get unique addresses
  const addressMap = new Map<string, LocationInfo>();
  
  // Helper to add unique addresses to the map, excluding the target address
  const addUniqueToMap = (pool: LocationInfo[]) => {
    for (const loc of pool) {
      const trimmedAddress = loc.address.trim();
      if (trimmedAddress !== target.address.trim() && !addressMap.has(trimmedAddress)) {
        addressMap.set(trimmedAddress, loc);
      }
      if (addressMap.size >= 10) break; // Get a decent pool to shuffle from
    }
  };

  // 1. Same district and same type
  addUniqueToMap(all.filter(l => l.id !== target.id && l.district === target.district && l.type === target.type));
  
  // 2. If not enough, same district any type
  if (addressMap.size < 3) {
    addUniqueToMap(all.filter(l => l.id !== target.id && l.district === target.district));
  }
  
  // 3. If still not enough, any district
  if (addressMap.size < 3) {
    addUniqueToMap(all.filter(l => l.id !== target.id));
  }
  
  const uniqueAddresses = Array.from(addressMap.keys());
  return shuffle(uniqueAddresses).slice(0, 3);
};

export const TAXI_REGULATIONS: Question[] = [
  { id: 'reg-1', category: 'REGULATIONS', question: '每部的士須安裝一個設計及構造獲誰批准及在指定位置和方式下裝配之的士計程錶？', options: ['的士車主', '運輸署署長', '警務處處長', '機電工程署署長'], answer: 1 },
  { id: 'reg-2', category: 'REGULATIONS', question: '下列哪一項不符合的士計程錶的構造規定？', options: ['構造須可封實，使未經損壞封條即不能將其打開', '錶面應設有照明設備，以便在黑暗中能清楚看見', '顯示車費和附加費的數字，高度不得少於 10 毫米', '構造須方便司機在故障時能自行拆開修理'], answer: 3 },
  { id: 'reg-3', category: 'REGULATIONS', question: '的士登記車主如欲移去或停止使用該的士計程錶時，必須在多少小時內通知署長？', options: ['12小時', '24小時', '48小時', '72小時'], answer: 1 },
  { id: 'reg-4', category: 'REGULATIONS', question: '的士計程錶指示器（旗）的面積不少於多少？', options: ['80毫米 x 40毫米', '100毫米 x 50毫米', '120毫米 x 60毫米', '150毫米 x 75毫米'], answer: 1 },
  { id: 'reg-5', category: 'REGULATIONS', question: '的士計程錶須每隔不超過多少個月進行覆試？', options: ['3個月', '6個月', '12個月', '18個月'], answer: 1 },
  { id: 'reg-6', category: 'REGULATIONS', question: '無理地損壞或更改的士計程錶，首次定罪最高可被罰款多少？', options: ['$5,000', '$10,000', '$15,000', '$25,000'], answer: 1 },
  { id: 'reg-7', category: 'REGULATIONS', question: '收據打印設備應能在多少秒內打印出一張車費收據？', options: ['5秒', '10秒', '12秒', '15秒'], answer: 2 },
  { id: 'reg-8', category: 'REGULATIONS', question: '收據打印設備打印出的車費收據，文字高度不得少於多少？', options: ['1毫米', '2毫米', '3毫米', '5毫米'], answer: 1 },
  { id: 'reg-9', category: 'REGULATIONS', question: '若收據打印設備故障，的士司機應如何處理？', options: ['拒絕發出收據', '採用預先印備的表格自行填寫收據', '口頭告知車費', '要求乘客留下聯絡電話'], answer: 1 },
  { id: 'reg-10', category: 'REGULATIONS', question: '的士車身左右兩旁須以中、英文標明「TAXI」和「的士」字樣，高度不得少於多少？', options: ['50毫米', '80毫米', '100毫米', '120毫米'], answer: 2 },
  { id: 'reg-11', category: 'REGULATIONS', question: '的士座位限額字牌的顏色組合是：', options: ['紅底白字', '綠底白字', '白底黑字', '藍底白字'], answer: 1 },
  { id: 'reg-12', category: 'REGULATIONS', question: '警務處處長有權指定臨時的士站，為時不超過多少小時？', options: ['24小時', '48小時', '72小時', '96小時'], answer: 2 },
  { id: 'reg-13', category: 'REGULATIONS', question: '的士租用時間的計算，以下列哪項較早者為準？', options: ['由啟程的時候起計算', '由指定的時間及地點以供租用人使用的時候起計算', '以上兩項中較早者', '以上兩項中較遲者'], answer: 2 },
  { id: 'reg-14', category: 'REGULATIONS', question: '擺放在乘客車廂內的輕便個人手提行李，若長、闊、高總和不超過多少，可獲免費運載？', options: ['100厘米', '120厘米', '140厘米', '160厘米'], answer: 2 },
  { id: 'reg-15', category: 'REGULATIONS', question: '的士司機可就每件擺放在車尾行李廂內的行李，向乘客收取多少行李附加費？', options: ['$5', '$6', '$7', '$8'], answer: 1 },
  { id: 'reg-16', category: 'REGULATIONS', question: '傷殘人士攜帶的輪椅或拐杖，其運載費用為：', options: ['每件$6', '每件$5', '免費', '視乎司機決定'], answer: 2 },
  { id: 'reg-17', category: 'REGULATIONS', question: '的士運載動物或雀鳥的附帶條件由誰決定？', options: ['運輸署署長', '的士司機酌情決定', '警務處處長', '法例強制規定'], answer: 1 },
  { id: 'reg-18', category: 'REGULATIONS', question: '的士司機拾獲失物後，如物主未及早認領，須在多少小時內送交警署？', options: ['2小時', '6小時', '12小時', '24小時'], answer: 1 },
  { id: 'reg-19', category: 'REGULATIONS', question: '的士司機如在車內發現失物，而該失物價值超過多少，應立即送交警署？', options: ['$任何價值','$100',  '$500', '$1,000'], answer: 0 },
  { id: 'reg-20', category: 'REGULATIONS', question: '的士司機如無合理原因，拒絕將的士駛往租用人指明的地點，在記分制下會被記多少分？', options: ['3分', '5分', '8分', '10分'], answer: 3 },
  { id: 'reg-21', category: 'REGULATIONS', question: '「濫收車費」在的士司機違例記分制下會被記多少分？', options: ['3分', '5分', '10分', '15分'], answer: 2 },
  { id: 'reg-22', category: 'REGULATIONS', question: '的士司機在兩年內累計被記多少分，會收到「強制修習的士服務改進課程通知」？', options: ['8分', '10分', '15分', '20分'], answer: 1 },
  { id: 'reg-23', category: 'REGULATIONS', question: '的士司機在兩年內累計被記多少分或以上，可被取消駕駛的士資格？', options: ['10分', '15分', '20分', '25分'], answer: 1 },
  { id: 'reg-24', category: 'REGULATIONS', question: '的士司機在完成改進課程並通過考試後，最多可從累計分數中扣減多少分？', options: ['2分', '3分', '5分', '全部'], answer: 1 },
  { id: 'reg-25', category: 'REGULATIONS', question: '市區的士首2公里或其任何部分的最高收費為：', options: ['$24', '$25.5', '$27', '$29'], answer: 3 },
  { id: 'reg-26', category: 'REGULATIONS', question: '新界的士首2公里或其任何部分的最高收費為：', options: ['$24', '$25.5', '$27', '$29'], answer: 1 },
  { id: 'reg-27', category: 'REGULATIONS', question: '大嶼山的士首2公里或其任何部分的最高收費為：', options: ['$24', '$25.5', '$27', '$29'], answer: 0 },
  { id: 'reg-28', category: 'REGULATIONS', question: '使用海底隧道、東區海底隧道或西區海底隧道，乘客通常須繳付多少回程費？', options: ['$10', '$15', '$20', '$25'], answer: 3 },
  { id: 'reg-29', category: 'REGULATIONS', question: '由2026年4月1日起，的士司機必須容許乘客透過至少多少種二維碼電子繳費媒介繳付車費？', options: ['一種', '二種', '三種', '不限'], answer: 0 },
  { id: 'reg-30', category: 'REGULATIONS', question: '的士司機若重犯「濫收車費」等嚴重罪行，最高罰款額可提高至多少？', options: ['$10,000', '$15,000', '$20,000', '$25,000'], answer: 3 },
  { id: 'reg-31', category: 'REGULATIONS', question: '市區的士車隊的識別牌底色為：', options: ['紅色', '綠色', '藍色', '白色'], answer: 0 },
  { id: 'reg-32', category: 'REGULATIONS', question: '非車隊的士若在車隊的士停車處停留，一經檢控會被定額罰款多少？', options: ['$320', '$400', '$450', '$600'], answer: 1 },
  { id: 'reg-33', category: 'REGULATIONS', question: '的士司機在工作時，應備有足夠輔幣，其中$10面額鈔票或$2或以上硬幣須達多少？', options: ['$50', '$80', '$90', '$100'], answer: 2 },
  { id: 'reg-34', category: 'REGULATIONS', question: '的士司機在工作時，應備有足夠輔幣，其中$1或以下硬幣須達多少？', options: ['$5', '$10', '$15', '$20'], answer: 1 },
  { id: 'reg-35', category: 'REGULATIONS', question: '的士司機如遇上拒絕佩帶安全帶的乘客，可以：', options: ['強行幫乘客佩帶', '拒絕租用或要求乘客下車', '向乘客收取額外費用', '報警處理'], answer: 1 },
  { id: 'reg-36', category: 'REGULATIONS', question: '的士車頂照明標誌應在何時亮著？', options: ['任何時候', '僅在載客時', '在夜間可供出租時', '僅在雨天時'], answer: 2 },
  { id: 'reg-37', category: 'REGULATIONS', question: '的士司機證托架必須顯示在車廂內什麼位置？', options: ['司機座位後方', '儀錶板上', '左邊車門旁', '後座中間位置'], answer: 1 },
  { id: 'reg-38', category: 'REGULATIONS', question: '的士司機在車廂內時不得：', options: ['聽收音機', '吸煙', '使用導航', '與乘客交談'], answer: 1 },
  { id: 'reg-39', category: 'REGULATIONS', question: '的士站首兩部的士司機應：', options: ['在車外招攬生意', '坐在車內或站在旁邊準備隨時供人租賃', '在車內睡覺', '離開車輛去洗手間'], answer: 1 },
  { id: 'reg-40', category: 'REGULATIONS', question: '的士司機在租用人表示乘搭意圖後，故意拒絕租賃，記分制下記多少分？', options: ['3分', '5分', '10分', '15分'], answer: 2 },
  { id: 'reg-41', category: 'REGULATIONS', question: '的士司機「兜客」在記分制下記多少分？', options: ['3分', '5分', '10分', '15分'], answer: 1 },
  { id: 'reg-42', category: 'REGULATIONS', question: '未經租用人同意，允許租用人以外的人登上的士（釣泥鯭），記多少分？', options: ['3分', '5分', '10分', '15分'], answer: 1 },
  { id: 'reg-43', category: 'REGULATIONS', question: '的士司機拒絕發出收據，記多少分？', options: ['3分', '5分', '10分', '15分'], answer: 0 },
  { id: 'reg-44', category: 'REGULATIONS', question: '的士司機沒有將計程錶設定於記錄位置，記多少分？', options: ['3分', '5分', '10分', '15分'], answer: 0 },
  { id: 'reg-45', category: 'REGULATIONS', question: '的士司機在接受租賃後，應採用什麼路線？', options: ['最快到達的路線', '最少紅綠燈的路線', '最直接可行的路線', '乘客指定的任何路線'], answer: 2 },
  { id: 'reg-46', category: 'REGULATIONS', question: '的士司機在完成每一次行程時，應：', options: ['立即駛離', '小心檢查車輛以確定有否失物', '下車休息', '立即尋找下一位乘客'], answer: 1 },
  { id: 'reg-47', category: 'REGULATIONS', question: '的士車身外面所髹油漆的顏色由誰規定？', options: ['的士車主', '運輸署署長', '警務處處長', '行政長官'], answer: 1 },
  { id: 'reg-48', category: 'REGULATIONS', question: '的士司機如無理地損壞或更改計程錶，再次定罪最高可被罰款多少？', options: ['$10,000', '$15,000', '$20,000', '$25,000'], answer: 3 },
  { id: 'reg-49', category: 'REGULATIONS', question: '的士司機在工作時，如被要求，必須出示：', options: ['身份證', '的士司機證', '駕駛執照', '以上皆是'], answer: 1 },
  { id: 'reg-50', category: 'REGULATIONS', question: '的士計程錶若因故障引致車費記錄不正確，的士登記車主須在合理可行範圍內盡早向誰報告？', options: ['警務處處長', '運輸署署長', '機電工程署署長', '的士商會'], answer: 1 },
  { id: 'reg-51', category: 'REGULATIONS', question: '的士內安裝的攝錄系統，其錄像必須：', options: ['可供司機隨時查閱', '以連續循環方式記錄', '每小時自動刪除一次', '儲存在司機的手機中'], answer: 1 },
  { id: 'reg-52', category: 'REGULATIONS', question: '的士攝錄系統若發生故障，司機須在多少小時內向署長報告？', options: ['12小時', '24小時', '48小時', '72小時'], answer: 2 },
  { id: 'reg-53', category: 'REGULATIONS', question: '的士司機如未能在攝錄系統故障後指定時間內報告，最高可被罰款多少？', options: ['$1,000', '$2,000', '$5,000', '$10,000'], answer: 1 },
  { id: 'reg-54', category: 'REGULATIONS', question: '在過海的士站停車候客之的士司機，可拒絕接載哪類乘客？', options: ['攜帶寵物的乘客', '非經由海底隧道而到達目的地的乘客', '使用電子支付的乘客', '前往新界的乘客'], answer: 1 },
  { id: 'reg-55', category: 'REGULATIONS', question: '的士司機在租用人表示乘搭意圖後，故意拒絕租賃，最高罰款額為：', options: ['$5,000', '$10,000', '$15,000', '$20,000'], answer: 1 },
  { id: 'reg-56', category: 'REGULATIONS', question: '的士司機如被控以「兜客」罪名，最高可被判處監禁多久？', options: ['1個月', '3個月', '6個月', '12個月'], answer: 2 },
  { id: 'reg-57', category: 'REGULATIONS', question: '的士司機在工作時，不得與其他司機結聚或聚集，以致對公眾人士造成：', options: ['交通阻塞', '滋擾', '威脅', '不安'], answer: 1 },
  { id: 'reg-58', category: 'REGULATIONS', question: '的士司機在接受租賃後，不得在沒有合理辯解下：', options: ['拒絕駛往乘客指定的目的地', '拒絕採用最直接可行的路線', '中途終止租賃', '以上皆是'], answer: 3 },
  { id: 'reg-59', category: 'REGULATIONS', question: '的士司機在工作時，必須確保車輛及個人：', options: ['整潔', '穿著制服', '配戴名牌', '噴灑香水'], answer: 0 },
  { id: 'reg-60', category: 'REGULATIONS', question: '的士司機在載客時，不得：', options: ['使用流動電話（除非使用免提裝置）', '飲食', '閱讀報刊', '以上皆是'], answer: 3 },
  { id: 'reg-61', category: 'REGULATIONS', question: '的士司機如拾獲失物，在送交警署前應：', options: ['自行保管', '保持物件原狀', '打開檢查內容', '貼上標籤'], answer: 1 },
  { id: 'reg-62', category: 'REGULATIONS', question: '的士司機在工作時，不得吸煙，這規定適用於：', options: ['只有載客時', '只有在禁區內', '任何時候', '只有在夜間'], answer: 2 },
  { id: 'reg-63', category: 'REGULATIONS', question: '的士司機在接受租賃時，應：', options: ['有禮貌地向乘客打招呼', '詢問乘客目的地', '確保計程錶已設定', '以上皆是'], answer: 3 },
  { id: 'reg-64', category: 'REGULATIONS', question: '的士司機如無理地拒絕載客，最高可被罰款多少？', options: ['$5,000', '$10,000', '$15,000', '$20,000'], answer: 1 },
  { id: 'reg-65', category: 'REGULATIONS', question: '的士司機在工作時，必須攜帶：', options: ['有效的駕駛執照', '有效的的士司機證', '身份證', '以上皆是'], answer: 3 },
  { id: 'reg-66', category: 'REGULATIONS', question: '的士計程錶的錶面除了區分元和角，還須註明哪些英文字母？', options: ["FEE 及 SURCHARGE", "FARE 及 EXTRAS", "PRICE 及 EXTRAS"], answer: 1 },
  { id: 'reg-67', category: 'REGULATIONS', question: '的士計程錶開關「STOPPED」代表什麼狀態？', options: ["租賃中", "供出租", "停止"], answer: 2 },
  { id: 'reg-68', category: 'REGULATIONS', question: '當的士計程錶開關處於「FOR HIRE」時，站在的士前面多少米處的人可清楚看見其指示器？', options: ["10米", "30米", "20米"], answer: 2 },
  { id: 'reg-69', category: 'REGULATIONS', question: '的士計程錶開關操作的次序必須是：', options: ["FOR HIRE -> STOPPED -> HIRED -> FOR HIRE", "STOPPED -> FOR HIRE -> HIRED -> STOPPED", "FOR HIRE -> HIRED -> STOPPED -> FOR HIRE"], answer: 2 },
  { id: 'reg-70', category: 'REGULATIONS', question: '的士計程錶若因損壞引致車費記錄不正確，的士登記車主須盡早向誰報告？', options: ["警務處處長", "運輸署署長", "機電工程署署長"], answer: 1 },
  { id: 'reg-71', category: 'REGULATIONS', question: '的士計程錶在裝置前若未得署長認可，最高可被處罰款及監禁多久？', options: ["$10,000及監禁6個月", "$5,000及監禁3個月", "$25,000及監禁12個月"], answer: 0 },
  { id: 'reg-72', category: 'REGULATIONS', question: '收據打印設備打印出的字體必須是甚麼顏色？', options: ["黑色或紅色", "藍色或綠色", "黑色或藍色"], answer: 2 },
  { id: 'reg-73', category: 'REGULATIONS', question: '收據打印設備打印出的字體必須印在甚麼顏色的紙張上？', options: ["黃色", "粉紅色", "白色"], answer: 2 },
  { id: 'reg-74', category: 'REGULATIONS', question: '的士車主如不遵從法例上有關車費收據打印設備的規定，最高可被處罰款及監禁多久？', options: ["$5,000及監禁3個月", "$15,000及監禁6個月", "$10,000及監禁6個月"], answer: 2 },
  { id: 'reg-75', category: 'REGULATIONS', question: '如的士司機不遵從發出車費收據的法例，最高可被處罰款多少？', options: ["$10,000", "$5,000", "$2,000"], answer: 1 },
  { id: 'reg-76', category: 'REGULATIONS', question: '的士行車記錄系統的「車上錄影」功能包含甚麼？', options: ["帶有錄音的錄影", "不帶錄音的錄影", "只有錄音沒有錄影"], answer: 0 },
  { id: 'reg-77', category: 'REGULATIONS', question: '的士行車記錄系統的「行車記錄器錄影」（車外視景）是否帶有錄音？', options: ["視乎司機設定", "帶有錄音", "不帶有錄音"], answer: 2 },
  { id: 'reg-78', category: 'REGULATIONS', question: '的士行車記錄系統須以甚麼方式封妥以成為認可系統？', options: ["封條封妥", "密碼鎖鎖上", "金屬網罩蓋住"], answer: 0 },
  { id: 'reg-79', category: 'REGULATIONS', question: '的士車廂內應清楚展示甚麼，以告知乘客的士設有行車記錄系統？', options: ["語音廣播", "閃爍指示燈", "告示"], answer: 2 },
  { id: 'reg-80', category: 'REGULATIONS', question: '的士行車記錄系統何時開始自動錄影和收集數據？', options: ["隨着驅動系統啟動時", "當計程錶按下時", "當車門關上時"], answer: 0 },
  { id: 'reg-81', category: 'REGULATIONS', question: '的士車主和司機能否自行關閉行車記錄系統？', options: ["不能", "可以，在休息時", "可以，在沒有乘客時"], answer: 0 },
  { id: 'reg-82', category: 'REGULATIONS', question: '任何人毀損的士之認可行車記錄系統，一經定罪可處罰款及監禁多久？', options: ["$25,000及監禁12個月", "$5,000及監禁3個月", "$10,000及監禁6個月"], answer: 2 },
  { id: 'reg-83', category: 'REGULATIONS', question: '的士車頂的照明標誌應寫有甚麼英文字樣？', options: ["HIRE", "TAXI", "CAB"], answer: 1 },
  { id: 'reg-84', category: 'REGULATIONS', question: '的士車身左右兩旁的「TAXI」和「的士」字樣，字體大小有何規定？', options: ["英文字必須較大", "中文字必須較大", "字體大小應一致"], answer: 2 },
  { id: 'reg-85', category: 'REGULATIONS', question: '座位限額字牌必須在的士的甚麼位置展示？', options: ["車頂及擋風玻璃", "左右車門", "車頭及車尾"], answer: 2 },
  { id: 'reg-86', category: 'REGULATIONS', question: '一般的士車身外面所髹油漆的顏色配搭由誰藉憲報刊登公告規定？', options: ["運輸署署長", "的士商會", "警務處處長"], answer: 0 },
  { id: 'reg-87', category: 'REGULATIONS', question: '在正常情況下，的士司機不得隨意停車上落客，但在甚麼區例外？', options: ["巴士站", "任何黃線區", "指定其類型之的士站"], answer: 2 },
  { id: 'reg-88', category: 'REGULATIONS', question: '警務處處長指定臨時的士站，為時不超過多少小時？', options: ["48小時", "72小時", "24小時"], answer: 1 },
  { id: 'reg-89', category: 'REGULATIONS', question: '的士站內前面有空位時，該站的士之司機應怎樣做？', options: ["下車招客", "將其的士駛前", "留在原位等候"], answer: 1 },
  { id: 'reg-90', category: 'REGULATIONS', question: '在甚麼情況下，並非的士站第一部的士之司機可以接受租用？', options: ["前方所有的士均已接受租賃或前方司機不在附近", "只要乘客主動要求", "目的地是過海的行程"], answer: 0 },
  { id: 'reg-91', category: 'REGULATIONS', question: '一部可供出租的士之司機在夜間應怎樣做？', options: ["使車頂的「TAXI」標誌亮着", "亮起危險警告燈", "關閉車廂照明"], answer: 0 },
  { id: 'reg-92', category: 'REGULATIONS', question: '的士一經租賃，司機應把的士計程錶的指示器移到哪個位置？', options: ["停止計算的位置", "進行計算的位置", "待機位置"], answer: 1 },
  { id: 'reg-93', category: 'REGULATIONS', question: '終止租賃時，司機應立即把的士計程錶的指示器移到哪個位置？', options: ["進行計算的位置", "停止計算的位置", "關閉位置"], answer: 1 },
  { id: 'reg-94', category: 'REGULATIONS', question: '中英對照之的士服務收費表應擺放在哪裡？', options: ["收在手套箱內", "夾在太陽擋上", "符合署長規定的的士內位置"], answer: 2 },
  { id: 'reg-95', category: 'REGULATIONS', question: '的士司機證上的姓名須與甚麼文件所示者相同？', options: ["護照", "身份證", "駕駛執照"], answer: 1 },
  { id: 'reg-96', category: 'REGULATIONS', question: '的士司機證托架必須顯示甚麼號碼？', options: ["司機的駕駛執照號碼", "司機證的發出編號", "該部的士的車輛登記號碼"], answer: 2 },
  { id: 'reg-97', category: 'REGULATIONS', question: '的士的註冊車主將車輛出租前，應與租用人填寫及簽署一式多少份的文件？', options: ["一式兩份", "一份", "一式三份"], answer: 0 },
  { id: 'reg-98', category: 'REGULATIONS', question: '出租車輛的協議文件中，車主必須保留該文件多久以供警務人員要求時出示？', options: ["三個月", "六個月", "一個月"], answer: 0 },
  { id: 'reg-99', category: 'REGULATIONS', question: '在的士車隊制度下，新界的士車隊識別牌的底色是甚麼？', options: ["藍色", "紅色", "綠色"], answer: 2 },
  { id: 'reg-100', category: 'REGULATIONS', question: '在的士車隊制度下，大嶼山的士車隊識別牌的底色是甚麼？', options: ["紅色", "藍色", "綠色"], answer: 1 },
  { id: 'reg-101', category: 'REGULATIONS', question: '在的士車隊制度下，市區的士車隊識別牌的底色是甚麼？', options: ["紅色", "綠色", "黃色"], answer: 0 },
  { id: 'reg-102', category: 'REGULATIONS', question: '一般的士在車隊的士停車處停留，一經檢控會被定額罰款多少？', options: ["$320", "$400", "$500"], answer: 1 },
  { id: 'reg-103', category: 'REGULATIONS', question: '車隊的士就「預定行程」可否自訂車費？', options: ["不可以", "可以", "只可減少不可增加"], answer: 1 },
  { id: 'reg-104', category: 'REGULATIONS', question: '車隊的士在「街頭截乘」的收費標準是甚麼？', options: ["可自行加收10%", "與一般的士相同", "免收附加費"], answer: 1 },
  { id: 'reg-105', category: 'REGULATIONS', question: '的士不得運載甚麼性質的貨物？', options: ["超過20公斤的個人行李", "任何體積超過50厘米的物件", "危險或厭惡性質及未經牢固包裝的貨物"], answer: 2 },
  { id: 'reg-106', category: 'REGULATIONS', question: '每件擺放在車尾行李廂內的行李，的士司機可向乘客收取多少附加費？', options: ["$6", "$10", "$5"], answer: 0 },
  { id: 'reg-107', category: 'REGULATIONS', question: '每隻動物或鳥類，的士司機可向乘客收取多少附加費？', options: ["$6", "$5", "$10"], answer: 1 },
  { id: 'reg-108', category: 'REGULATIONS', question: '的士每程電召預約服務的附加費是多少？', options: ["$5", "$6", "$10"], answer: 0 },
  { id: 'reg-109', category: 'REGULATIONS', question: '乘客如在過海的士站上車，是否需要繳付海底隧道的回程費？', options: ["需要繳付$25", "需要繳付$15", "毋須繳付"], answer: 2 },
  { id: 'reg-110', category: 'REGULATIONS', question: '乘客如最終目的地非位於海港的另一方，是否需要繳付海底隧道的回程費？', options: ["繳付半價回程費", "需要繳付全費", "毋須繳付"], answer: 2 },
  { id: 'reg-111', category: 'REGULATIONS', question: '任何人如在的士內拾獲他人留下的物件，應怎樣做？', options: ["保持原狀並立即交給司機", "放在車上不理會", "自行送交警署"], answer: 0 },
  { id: 'reg-112', category: 'REGULATIONS', question: '的士司機如遇上拒絕佩帶安全帶的乘客，乘客須支付甚麼費用？', options: ["雙倍車資", "毋須支付車資", "的士計程錶上記錄的法定車資"], answer: 2 },
  { id: 'reg-113', category: 'REGULATIONS', question: '根據違例記分制，司機「濫收車費」會被記多少分？', options: ["10分", "5分", "3分"], answer: 0 },
  { id: 'reg-114', category: 'REGULATIONS', question: '根據違例記分制，司機「故意拒絕或忽略接受租用」會被記多少分？', options: ["3分", "5分", "10分"], answer: 2 },
  { id: 'reg-115', category: 'REGULATIONS', question: '根據違例記分制，司機「拒絕或忽略駕駛的士至租用人指示的地方」會被記多少分？', options: ["10分", "3分", "5分"], answer: 0 },
  { id: 'reg-116', category: 'REGULATIONS', question: '根據違例記分制，司機「毁損、損壞或更改的士計程錶」會被記多少分？', options: ["3分", "5分", "10分"], answer: 2 },
  { id: 'reg-117', category: 'REGULATIONS', question: '根據違例記分制，司機「兜客」會被記多少分？', options: ["10分", "3分", "5分"], answer: 2 },
  { id: 'reg-118', category: 'REGULATIONS', question: '根據違例記分制，司機「沒有採用最直接而切實可行的路綫駛往目的地（兜路）」會被記多少分？', options: ["5分", "10分", "3分"], answer: 0 },
  { id: 'reg-119', category: 'REGULATIONS', question: '根據違例記分制，司機「未經租用人同意，允許其他人登上的士（釣泥鯭）」會被記多少分？', options: ["5分", "10分", "3分"], answer: 0 },
  { id: 'reg-120', category: 'REGULATIONS', question: '根據違例記分制，司機「欺騙或拒絕知會乘客有關適當的收費及路綫」會被記多少分？', options: ["5分", "10分", "3分"], answer: 0 },
  { id: 'reg-121', category: 'REGULATIONS', question: '根據違例記分制，司機「拒絕或忽略運載租用人要求數目的乘客」會被記多少分？', options: ["10分", "3分", "5分"], answer: 1 },
  { id: 'reg-122', category: 'REGULATIONS', question: '根據違例記分制，司機「拒絕或忽略發出收據」會被記多少分？', options: ["10分", "5分", "3分"], answer: 2 },
  { id: 'reg-123', category: 'REGULATIONS', question: '根據違例記分制，司機「沒有將的士計程錶設定於記錄位置」會被記多少分？', options: ["5分", "10分", "3分"], answer: 2 },
  { id: 'reg-124', category: 'REGULATIONS', question: '市區的士首2公里或其任何部分的收費為多少？', options: ["$27", "$25.5", "$29"], answer: 2 },
  { id: 'reg-125', category: 'REGULATIONS', question: '新界的士首2公里或其任何部分的收費為多少？', options: ["$29", "$25.5", "$24"], answer: 1 },
  { id: 'reg-126', category: 'REGULATIONS', question: '大嶼山的士首2公里或其任何部分的收費為多少？', options: ["$24", "$25.5", "$29"], answer: 0 },
  { id: 'reg-127', category: 'REGULATIONS', question: '市區的士在應收款額達$102.5後，每跳（200米或每分鐘等候）收費為多少？', options: ["$2.1", "$1.4", "$1.9"], answer: 1 },
  { id: 'reg-128', category: 'REGULATIONS', question: '市區的士在應收款額達$102.5前，每跳收費為多少？', options: ["$2.1", "$1.4", "$1.9"], answer: 0 },
  { id: 'reg-129', category: 'REGULATIONS', question: '新界的士在應收款額達$82.5後，每跳收費為多少？', options: ["$1.4", "$1.9", "$2.1"], answer: 0 },
  { id: 'reg-130', category: 'REGULATIONS', question: '新界的士在應收款額達$82.5前，每跳收費為多少？', options: ["$1.9", "$1.4", "$2.1"], answer: 0 },
  { id: 'reg-131', category: 'REGULATIONS', question: '大嶼山的士在應收款額達$195後，每跳收費為多少？', options: ["$1.9", "$1.6", "$1.4"], answer: 1 },
  { id: 'reg-132', category: 'REGULATIONS', question: '大嶼山的士在應收款額達$195前，每跳收費為多少？', options: ["$1.6", "$1.9", "$1.4"], answer: 1 },
  { id: 'reg-133', category: 'REGULATIONS', question: '如果的士計程錶在調整收費後未及調校，司機應如何發出車費收據？', options: ["用手寫方式在收據總車費旁寫上新總收費", "拒絕發出收據", "口頭告知乘客新收費"], answer: 0 },
  { id: 'reg-134', category: 'REGULATIONS', question: '的士行車記錄系統的位置數據是透過甚麼系統接收訊號？', options: ["全球導航衞星系統", "本地流動網絡基地台", "無線電廣播系統"], answer: 0 },
  { id: 'reg-135', category: 'REGULATIONS', question: '的士行車記錄系統在年度檢驗時須接受甚麼？', options: ["強制軟件升級", "計程錶重新更換", "行車記錄系統檢驗"], answer: 2 },
  { id: 'reg-136', category: 'REGULATIONS', question: '如果行車記錄系統發生故障，的士車主及獲授權安裝人有何責任？', options: ["通知警務處處長", "盡快向署長報告及安排維修", "自行拆除系統"], answer: 1 },
  { id: 'reg-137', category: 'REGULATIONS', question: '在行車記錄系統回復良好運作前，的士能否作出租用途？', options: ["可以，只要計程錶正常", "不能", "可以，但要減收車費"], answer: 1 },
  { id: 'reg-138', category: 'REGULATIONS', question: '的士司機證的照片有何規定？', options: ["必須附有司機的照片", "不需要照片", "只需列印證件號碼即可"], answer: 0 },
  { id: 'reg-139', category: 'REGULATIONS', question: '的士車身上用作顯示座位限額的字牌，其大小及設計必須符合誰的要求？', options: ["運輸署署長", "的士製造商", "警務處處長"], answer: 0 },
  { id: 'reg-140', category: 'REGULATIONS', question: '在法例禁止的停車上落客區，的士司機能否應乘客要求停車？', options: ["不能", "可以，只要安全", "可以，但只可落客不可上客"], answer: 0 },
  { id: 'reg-141', category: 'REGULATIONS', question: '的士服務收費表在的士內的設計、構造及擺放位置須符合誰的規定？', options: ["運輸署署長", "司機自行決定", "的士車主"], answer: 0 },
  { id: 'reg-142', category: 'REGULATIONS', question: '獲准在出租期間駕駛車輛的人士，必須持有甚麼證件？', options: ["只需要身份證", "只需普通駕駛執照", "有效之的士駕駛執照及的士司機證"], answer: 2 },
  { id: 'reg-143', category: 'REGULATIONS', question: '車隊的士證明書應展示在車輛甚麼位置？', options: ["前方檔風玻璃上", "車頂標誌旁", "後座車窗上"], answer: 0 },
  { id: 'reg-144', category: 'REGULATIONS', question: '誰有權指定某段道路範圍為的士停車候客區？', options: ["機電工程署署長", "立法會", "運輸署署長"], answer: 2 },
  { id: 'reg-145', category: 'REGULATIONS', question: '的士計程錶須每隔不超過多少個月進行覆試？', options: ["3個月", "12個月", "6個月"], answer: 2 },
  { id: 'reg-146', category: 'REGULATIONS', question: '的士計程錶覆試時除了試驗結果滿意，還需證明甚麼運作良好才由署長蓋印？', options: ["收據打印設備", "引擎驅動系統", "車廂空調系統"], answer: 0 },
  { id: 'reg-147', category: 'REGULATIONS', question: '如車費收據發生故障，司機應採用預先印備的表格填寫收據，該表格格式見於何處？', options: ["司機自行設計格式", "由車隊持牌人指定格式", "附錄乙的指定格式"], answer: 2 },
  { id: 'reg-148', category: 'REGULATIONS', question: '在的士違例記分制下，「拒絕運載租用人要求數目的乘客」被記多少分？', options: ["5分", "10分", "3分"], answer: 2 },
  { id: 'reg-149', category: 'REGULATIONS', question: '車隊的士若在街頭截乘，車費是否可以預先與乘客協定為整筆車費？', options: ["可以，只要乘客同意", "不可以，須按計程錶收費表收費", "可以，但不可高於計程錶10%"], answer: 1 },
  { id: 'reg-150', category: 'REGULATIONS', question: '使用大欖隧道的附加費是如何計算的？', options: ["$15", "司機所付的隧道費", "$25"], answer: 1 }
];

export const PLACES: Question[] = LOCATION_DATA.map((l) => {
  const distractors = getDistractors(l, LOCATION_DATA);
  const options = shuffle([l.address, ...distractors]);
  const answerIdx = options.indexOf(l.address);
  
  const questionText = l.type === 'street' 
    ? `${l.name}位於哪條街道？` 
    : `${l.name}位於哪裡？`;

  return {
    id: `p-${l.id}`,
    category: 'PLACES',
    question: questionText,
    options,
    answer: answerIdx
  };
});

export const ROUTES: Question[] = [
  // User provided 15 routes (10 from snippet + 5 generated to match style)
  { id: 'route-1', category: 'ROUTES', question: '由 西貢匡湖居 駛至 大口環根德公爵夫人兒童醫院，最直接經哪條隧道？', options: ['西區海底隧道', '紅磡海底隧道', '東區海底隧道', '大欖隧道'], answer: 0 },
  { id: 'route-2', category: 'ROUTES', question: '由 紅磡高山劇場 駛至 長沙灣廣場，最直接經哪些街道？', options: ['佛光街、梭椏道及亞皆老街', '彌敦道及長沙灣道', '公主道及窩打老道', '漆咸道北及加士居道'], answer: 0 },
  { id: 'route-3', category: 'ROUTES', question: '由 荃灣環宇海灣 駛至 米埔自然保護區，最直接經哪些道路？', options: ['大欖隧道及青朗公路', '城門隧道及吐露港公路', '青山公路及新田公路', '尖山隧道及粉嶺公路'], answer: 0 },
  { id: 'route-4', category: 'ROUTES', question: '由 元朗大會堂 駛至 馬鞍山新港城中心，最直接經哪條公路？', options: ['林錦公路', '粉嶺公路', '大埔公路', '吐露港公路'], answer: 0 },
  { id: 'route-5', category: 'ROUTES', question: '由 荃灣沙咀道遊樂場 駛至 沙田中心，最直接經哪些街道？', options: ['大河道及象鼻山道', '青山公路', '德士古道', '城門道'], answer: 0 },
  { id: 'route-6', category: 'ROUTES', question: '由 深水埗南昌邨 駛至 港鐵上水站，最直接經哪些道路？', options: ['青沙公路及尖山隧道', '大埔公路', '獅子山隧道', '吐露港公路'], answer: 0 },
  { id: 'route-7', category: 'ROUTES', question: '由 佐敦(西九龍站)巴士總站 駛至 銅鑼灣皇悅酒店，最直接經哪些道路？', options: ['康莊道及紅磡海底隧道', '西區海底隧道', '東區海底隧道', '告士打道'], answer: 0 },
  { id: 'route-8', category: 'ROUTES', question: '由 九龍塘又一城 駛至 沙田大會堂，最直接經哪些道路？', options: ['窩打老道及獅子山隧道', '大老山隧道', '尖山隧道', '大埔公路'], answer: 0 },
  { id: 'route-9', category: 'ROUTES', question: '由 西九文化區戲曲中心 駛至 九龍灣德福廣場，最直接經哪些道路？', options: ['漆咸道北、東九龍走廊及啟德隧道', '龍翔道', '觀塘道', '亞皆老街'], answer: 0 },
  { id: 'route-10', category: 'ROUTES', question: '由 上水廣場 駛至 入境事務處總部，最直接經哪些道路？', options: ['粉嶺公路及大老山隧道', '獅子山隧道', '紅磡海底隧道', '西區海底隧道'], answer: 0 },
  { id: 'route-11', category: 'ROUTES', question: '由 基督教聯合醫院 駛至 旺角區警署，最直接經哪些道路？', options: ['新清水灣道及太子道東', '觀塘道', '龍翔道', '亞皆老街'], answer: 0 },
  { id: 'route-12', category: 'ROUTES', question: '由 荃灣荃豐中心 駛至 新蒲崗香港考試及評核局，最直接經哪些道路？', options: ['青山公路葵涌段及龍翔道', '呈祥道', '大埔道', '界限街'], answer: 0 },
  { id: 'route-13', category: 'ROUTES', question: '由 紅磡置富都會 駛至 北角廉政公署總部大樓，最直接經哪條隧道？', options: ['紅磡海底隧道', '東區海底隧道', '西區海底隧道', '中環及灣仔繞道'], answer: 0 },
  { id: 'route-14', category: 'ROUTES', question: '由 九龍塘香港浸會大學大學會堂 駛至 灣仔鷹君中心，最直接經哪條隧道？', options: ['紅磡海底隧道', '西區海底隧道', '東區海底隧道', '獅子山隧道'], answer: 0 },
  { id: 'route-15', category: 'ROUTES', question: '由 九龍公共圖書館 駛至 跑馬地馬場，最直接經哪條隧道？', options: ['紅磡海底隧道', '西區海底隧道', '東區海底隧道', '香港仔隧道'], answer: 0 }];

  

export const ROAD_CODE: Question[] = [
  { id: 'road-1', category: 'ROAD_CODE', question: '在正常行車情況下，你與前車應保持多少安全距離？', options: ["兩秒鐘的行車距離", "一秒鐘的行車距離", "三秒鐘的行車距離"], answer: 0 },
  { id: 'road-2', category: 'ROAD_CODE', question: '如果在下雨或路面濕滑的情況下行車，你與前車的安全距離應為：', options: ["最少四秒的距離（將安全距離加倍）", "增加至三秒的距離", "維持兩秒的距離"], answer: 0 },
  { id: 'road-3', category: 'ROAD_CODE', question: '停車距離是由哪兩部分組成的？', options: ["車速及煞車距離", "反應距離及車輪轉動距離", "反應距離及煞車距離"], answer: 2 },
  { id: 'road-4', category: 'ROAD_CODE', question: '在沒有標明車速限制的普通道路上，一般車輛的最高車速限制為：', options: ["每小時70公里", "每小時80公里", "每小時50公里"], answer: 2 },
  { id: 'road-5', category: 'ROAD_CODE', question: '中型或重型貨車在快速公路上的最高車速限制是：', options: ["每小時70公里", "每小時50公里", "每小時100公里"], answer: 0 },
  { id: 'road-6', category: 'ROAD_CODE', question: '暫准駕駛執照（P牌）持有人在快速公路上行駛時，最高車速限制為：', options: ["每小時50公里", "每小時70公里", "該路段的最高限速"], answer: 1 },
  { id: 'road-7', category: 'ROAD_CODE', question: '學習駕駛者在道路上行駛時，其最高車速限制為：', options: ["每小時70公里", "與一般駕駛者相同", "每小時50公里"], answer: 2 },
  { id: 'road-8', category: 'ROAD_CODE', question: '當你以每小時80公里的速度行駛時，如發現前方有危險，通常需要多少煞車距離才能完全停定（在乾爽路面上）？', options: ["約60米", "約80米", "約40米"], answer: 0 },
  { id: 'road-9', category: 'ROAD_CODE', question: '在濃霧中行車，如能見度非常低，你應如何調整車速？', options: ["減速至能在看得到的距離內停定", "維持正常車速但不斷響號", "以不低於每小時50公里的速度行駛以免阻塞交通"], answer: 0 },
  { id: 'road-10', category: 'ROAD_CODE', question: '如你駕駛的車輛拖著另一輛車，在普通道路上的最高車速限制是：', options: ["每小時40公里", "每小時50公里", "每小時30公里"], answer: 1 },
  { id: 'road-11', category: 'ROAD_CODE', question: '在雙線雙程道路上，你應該：', options: ["盡量靠右行駛", "盡量靠左行駛", "在路中心行駛"], answer: 1 },
  { id: 'road-12', category: 'ROAD_CODE', question: '什麼情況下可以從左方超越前車？', options: ["任何時候只要左邊有空位", "前車發出信號表示即將右轉，而左方有足夠行車線空位", "在快速公路上前車開得太慢"], answer: 1 },
  { id: 'road-13', category: 'ROAD_CODE', question: '在迴旋處內，你應讓路給哪一方的車輛？', options: ["從左方駛入的車輛", "正在你右方或已在迴旋處內的車輛", "尾隨的車輛"], answer: 1 },
  { id: 'road-14', category: 'ROAD_CODE', question: '當你駛近沒有交通燈或警員指揮的十字路口時，應如何處理？', options: ["減速並準備讓路給在大路上的車輛", "響號警告其他車輛讓路", "加速通過"], answer: 0 },
  { id: 'road-15', category: 'ROAD_CODE', question: '在多線行車的道路上，最右線（快線）主要作甚麼用途？', options: ["一般行車", "超越前車或右轉", "停泊車輛"], answer: 1 },
  { id: 'road-16', category: 'ROAD_CODE', question: '當有緊急車輛（如救護車、消防車）亮起閃燈或響起警號駛近時，你應：', options: ["立即煞車停在路中心", "加速行駛以免阻礙", "盡快駛向路邊並讓路，必要時停車"], answer: 2 },
  { id: 'road-17', category: 'ROAD_CODE', question: '駛近行人過路處（斑馬線）時，如有人已踏上斑馬線，你必須：', options: ["停車讓行人先過馬路", "從行人前方繞過", "減速並響號"], answer: 0 },
  { id: 'road-18', category: 'ROAD_CODE', question: '在斜路交匯處，哪一方的車輛通常有優先權？', options: ["速度較快的車輛", "下坡的車輛", "上坡的車輛"], answer: 2 },
  { id: 'road-19', category: 'ROAD_CODE', question: '如果前面的交通擠塞，導致你無法完全通過交匯處，你應：', options: ["停在交匯處外等候，直至前方有足夠空間", "緊貼前車駛入交匯處", "響號催促前車"], answer: 0 },
  { id: 'road-20', category: 'ROAD_CODE', question: '在沒有行人過路設施的道路上，如有盲人攜帶白杖橫過馬路，你應：', options: ["停車讓他們先過馬路", "加速通過", "響號警告"], answer: 0 },
  { id: 'road-21', category: 'ROAD_CODE', question: '在哪種情況下，學習駕駛者可以使用快速公路？', options: ["在非繁忙時間", "絕對不准使用", "有合資格的駕駛教師在旁"], answer: 1 },
  { id: 'road-22', category: 'ROAD_CODE', question: '暫准駕駛執照（P牌）持有人在設有三條或以上行車線的快速公路上，有何限制？', options: ["只能在中間線行駛", "不准使用最右線", "不准使用最左線"], answer: 1 },
  { id: 'road-23', category: 'ROAD_CODE', question: '如車輛在快速公路上發生故障，你應怎樣做？', options: ["駛入路肩，亮警告燈，並在安全情況下離開車廂到防撞欄外等候救援", "留在車內並亮起危險警告燈", "站在車後揮手示意其他車輛避開"], answer: 0 },
  { id: 'road-24', category: 'ROAD_CODE', question: '進入隧道前，你必須：', options: ["響號以警告前方車輛", "除下太陽眼鏡並亮起車頭燈（低燈）", "亮起危險警告燈"], answer: 1 },
  { id: 'road-25', category: 'ROAD_CODE', question: '在隧道內行駛時，如果發生火警，你應該：', options: ["立即掉頭駛出隧道", "留在車內並緊閉車窗", "關掉引擎，把車匙留在車內，並迅速離開車廂走向緊急出口"], answer: 2 },
  { id: 'road-26', category: 'ROAD_CODE', question: '快速公路上的路肩（硬路肩）是用作：', options: ["超越慢車", "緊急情況下停車或壞車時使用", "短暫休息"], answer: 1 },
  { id: 'road-27', category: 'ROAD_CODE', question: '在快速公路上駛過出口時，如果你錯過了目標出口，應怎樣做？', options: ["在路肩掉頭", "立即倒車退回出口", "繼續駛往下一個出口"], answer: 2 },
  { id: 'road-28', category: 'ROAD_CODE', question: '在隧道內，甚麼情況下可以轉換行車線？', options: ["前車行駛太慢時", "沒有其他車輛時", "絕對不准轉換行車線（除非有特別指示）"], answer: 2 },
  { id: 'road-29', category: 'ROAD_CODE', question: '如果在快速公路上因擠塞而需要停車，你應：', options: ["下車察看前方情況", "關掉引擎以節省燃料", "亮起危險警告燈以警告尾隨車輛，直至後方有其他車輛停下為止"], answer: 2 },
  { id: 'road-30', category: 'ROAD_CODE', question: '牽引着另一輛車的車輛，在設有三條行車線的快速公路上：', options: ["沒有任何行車線限制", "不准使用最右線", "只能使用最左線"], answer: 1 },
  { id: 'road-31', category: 'ROAD_CODE', question: '在雙黃線路段，代表甚麼限制？', options: ["只准短暫上落客，不准泊車", "只准在日間停車", "任何時間均不准停車上落客或上落貨物"], answer: 2 },
  { id: 'road-32', category: 'ROAD_CODE', question: '在單實黃線路段，代表甚麼限制？', options: ["任何時間不准泊車", "只准的士上落客", "在標明限制的時間內不准停車上落客或貨物"], answer: 2 },
  { id: 'road-33', category: 'ROAD_CODE', question: '路面上畫有「鋸齒形白線」（之字線）的區域代表：', options: ["可作短暫上落客用途", "行人專用區", "絕對不准在此處停車（包括上落客）及超越前車"], answer: 2 },
  { id: 'road-34', category: 'ROAD_CODE', question: '在夜間，如果把車輛停泊在沒有足夠街燈照明的道路上，你必須：', options: ["亮起車廂內的燈光", "亮起泊車燈或小燈", "亮起危險警告燈"], answer: 1 },
  { id: 'road-35', category: 'ROAD_CODE', question: '在斜坡上泊車，除了拉緊手掣外，如果車頭向下坡，應入甚麼波檔（手動變速車輛）？', options: ["空波", "一波", "倒後波"], answer: 2 },
  { id: 'road-36', category: 'ROAD_CODE', question: '在斜坡上泊車，如果車頭向上坡且路邊有行人道石壆，應將前輪：', options: ["轉向路中心", "轉向行人道石壆", "保持平直"], answer: 0 },
  { id: 'road-37', category: 'ROAD_CODE', question: '在巴士站範圍內（實白線標記），一般車輛：', options: ["在生效時間內絕對不准停車", "可以隨時上落客", "可以短暫停泊"], answer: 0 },
  { id: 'road-38', category: 'ROAD_CODE', question: '消防局、救護站或警署門前通常畫有甚麼標記以禁止車輛停留？', options: ["黃色斜線區域", "黃色方格", "白色雙實線"], answer: 1 },
  { id: 'road-39', category: 'ROAD_CODE', question: '在距離行人過路處（斑馬線）多少米內通常不准泊車？', options: ["15米", "5米", "30米"], answer: 0 },
  { id: 'road-40', category: 'ROAD_CODE', question: '如要在陡斜的路上起步，最重要的操作是甚麼？', options: ["先響號警告後方車輛", "正確配合手掣和離合器（或油門），防止車輛溜後", "猛踏油門"], answer: 1 },
  { id: 'road-41', category: 'ROAD_CODE', question: '遇到交通燈亮起紅燈及黃燈時，你應：', options: ["準備開車", "可慢慢向前駛", "必須停車，等待綠燈亮起才可開車"], answer: 2 },
  { id: 'road-42', category: 'ROAD_CODE', question: '當交通燈亮起閃動的黃燈（行人過路處以外），表示：', options: ["讓路給其他車輛或行人，在安全情況下才可前進", "必須停車", "行人禁止過馬路"], answer: 0 },
  { id: 'road-43', category: 'ROAD_CODE', question: '駛近交通燈控制的路口，綠燈已亮了很久，你應：', options: ["加速通過", "準備隨時煞車，因為燈號可能隨時轉黃", "響號通過"], answer: 1 },
  { id: 'road-44', category: 'ROAD_CODE', question: '在夜間沒有街燈的道路上行駛，你應使用：', options: ["大燈（遠光燈），但在有迎面車輛或尾隨前車時須轉用低燈", "霧燈", "低燈（近光燈）"], answer: 0 },
  { id: 'road-45', category: 'ROAD_CODE', question: '危險警告燈（死火燈）應在甚麼情況下使用？', options: ["在雙黃線短暫上落客時", "車輛發生故障停在路面，或前方交通突然擠塞需警告後車", "下大雨時行駛"], answer: 1 },
  { id: 'road-46', category: 'ROAD_CODE', question: '在甚麼情況下可以使用霧燈？', options: ["夜間在市區行駛時", "在快速公路上作超車警告時", "當能見度降低至大約50米以下時（如濃霧或大雨）"], answer: 2 },
  { id: 'road-47', category: 'ROAD_CODE', question: '夜間被尾隨車輛的大燈眩目時，你應該：', options: ["減速，必要時停車，直到視力恢復", "加速駛離", "亮起危險警告燈"], answer: 0 },
  { id: 'road-48', category: 'ROAD_CODE', question: '在日間，如果下大雨導致能見度極低，你必須：', options: ["亮起大燈", "亮起車頭低燈（近光燈）", "亮起危險警告燈並繼續行駛"], answer: 1 },
  { id: 'road-49', category: 'ROAD_CODE', question: '甚麼情況下禁止閃動車頭燈？', options: ["除非為警告其他道路使用者以免發生危險，否則不應隨便閃燈", "為了表示讓路給其他車輛", "警告其他道路使用者你的存在"], answer: 0 },
  { id: 'road-50', category: 'ROAD_CODE', question: '交通燈的綠色箭頭代表：', options: ["所有方向皆可通行", "必須停車讓路", "在安全情況下，可向箭頭指示的方向行駛"], answer: 2 },
  { id: 'road-51', category: 'ROAD_CODE', question: '在設有安全島的行人過路處，行人過了第一段馬路在安全島等候，你應該：', options: ["響號警告他們不要走出", "視為兩段獨立的過路處，如行人未踏出第二段馬路，車輛有優先權", "必須停車讓他們過第二段馬路"], answer: 1 },
  { id: 'road-52', category: 'ROAD_CODE', question: '當你超越正在騎單車的人時，應預留多少橫向距離？', options: ["盡可能留出與超越汽車相同的空位", "不需預留特別距離", "至少半米"], answer: 0 },
  { id: 'road-53', category: 'ROAD_CODE', question: '在行人專用區的生效時間內，汽車駕駛者應：', options: ["以慢速駛過", "響號驅散行人", "絕對不准駛入（除獲特別豁免外）"], answer: 2 },
  { id: 'road-54', category: 'ROAD_CODE', question: '當你駛近學校附近，看到有兒童在行人道上時，你應：', options: ["加速盡快駛離", "減速並準備隨時停車", "響號警告他們"], answer: 1 },
  { id: 'road-55', category: 'ROAD_CODE', question: '遇到有學童橫過馬路的標牌或有交通導護員（護行員）舉起「停」字牌時，你必須：', options: ["停車等候，直至護行員示意可以前進或完全離開馬路", "減速並在學童之間穿過", "轉線避開"], answer: 0 },
  { id: 'road-56', category: 'ROAD_CODE', question: '如果行人在沒有行人過路設施的地方橫過馬路，你應：', options: ["減速或停車讓路，避免發生意外", "響號並維持車速", "加速並在他前方駛過"], answer: 0 },
  { id: 'road-57', category: 'ROAD_CODE', question: '行駛中遇到有人正牽帶馬匹或牲畜在路邊，你應：', options: ["開亮大燈警告", "減速，避免響號或發出引擎巨響，並預留足夠空位駛過", "響號並快速駛過"], answer: 1 },
  { id: 'road-58', category: 'ROAD_CODE', question: '在夜間，行人穿著甚麼顏色的衣物最容易被駕駛者看見？', options: ["淺色或反光衣物", "紅色或綠色", "黑色或深藍色"], answer: 0 },
  { id: 'road-59', category: 'ROAD_CODE', question: '當你準備轉左進入小路時，發現有行人正橫過該小路的馬路，你應：', options: ["加速搶在行人前轉入", "停車讓行人先過馬路", "響號警告行人退回"], answer: 1 },
  { id: 'road-60', category: 'ROAD_CODE', question: '駛經停在路邊的冰淇淋車或小食車時，你應特別留意甚麼？', options: ["可能有兒童從車後突然跑出馬路", "車輛會否突然開動", "車輛會否倒車"], answer: 0 },
  { id: 'road-61', category: 'ROAD_CODE', question: '在香港，駕駛者的法定酒精呼氣限制是每100毫升呼氣中含多少微克酒精？', options: ["22微克", "35微克", "50微克"], answer: 0 },
  { id: 'road-62', category: 'ROAD_CODE', question: '血液中的法定酒精限制是每100毫升血液中含多少毫克酒精？', options: ["50毫克", "22毫克", "80毫克"], answer: 0 },
  { id: 'road-63', category: 'ROAD_CODE', question: '警務人員要求你進行隨機呼氣測試（俗稱「吹波波」）時，你可否拒絕？', options: ["可以，除非有發生交通意外", "可以，如你覺得自己清醒", "不可以，無合理辯解而拒絕提供呼氣樣本即屬違法"], answer: 2 },
  { id: 'road-64', category: 'ROAD_CODE', question: '在行車期間，誰有法律責任確保15歲以下的乘客佩戴安全帶？', options: ["乘客的父母", "該名乘客本人", "司機"], answer: 2 },
  { id: 'road-65', category: 'ROAD_CODE', question: '駕駛者在甚麼情況下可以獲豁免佩戴安全帶？', options: ["在市區低速行駛時", "當正在倒車時", "在快速公路上行駛時"], answer: 1 },
  { id: 'road-66', category: 'ROAD_CODE', question: '駕駛時使用手提電話（手持），會面臨甚麼處罰？', options: ["定額罰款及違例駕駛記分", "口頭警告", "只作罰款"], answer: 0 },
  { id: 'road-67', category: 'ROAD_CODE', question: '如果在駕駛時感到疲倦或打瞌睡，最安全的做法是：', options: ["打開車窗吹風", "開大收音機音量或喝濃茶", "盡快在安全地方停車，並稍作休息"], answer: 2 },
  { id: 'road-68', category: 'ROAD_CODE', question: '服用了含有可導致昏睡副作用的感冒藥後，你應該：', options: ["慢速駕駛", "駕駛時更加集中精神", "絕對不要駕駛"], answer: 2 },
  { id: 'road-69', category: 'ROAD_CODE', question: '任何人如被法庭裁定危險駕駛引致他人死亡，最高可被判處：', options: ["罰款及停牌", "監禁10年及停牌", "監禁10年及終身停牌"], answer: 1 },
  { id: 'road-70', category: 'ROAD_CODE', question: '當車輛在道路上行駛時，2歲以下的兒童如坐在前座，必須：', options: ["使用認可的兒童束縛設備（如兒童汽車座椅）", "配戴普通的成人安全帶", "由成年人抱著"], answer: 0 },
  { id: 'road-71', category: 'ROAD_CODE', question: '私家車及輕型貨車的車胎，其胎面花紋深度最少須為：', options: ["1.6毫米", "1.0毫米", "2.0毫米"], answer: 1 },
  { id: 'road-72', category: 'ROAD_CODE', question: '中型貨車、重型貨車及巴士的車胎，其胎面花紋深度最少須為：', options: ["1.0毫米", "2.0毫米", "1.6毫米"], answer: 0 },
  { id: 'road-73', category: 'ROAD_CODE', question: '何時需要檢查車胎的氣壓最為準確？', options: ["在長途行車後", "在烈日下暴曬後", "車胎冷卻時"], answer: 2 },
  { id: 'road-74', category: 'ROAD_CODE', question: '法例規定，除非在危險情況下，否則在晚上11時至早上7時期間，在甚麼地方不准響號？', options: ["任何建有街道照明系統的道路（市區道路）", "快速公路", "限制區"], answer: 0 },
  { id: 'road-75', category: 'ROAD_CODE', question: '如你車輛的煞車系統失靈，你應怎樣做？', options: ["立即拉緊手掣", "關掉引擎", "轉用低波，利用引擎輔助減速，並在安全情況下駛向路邊拉手掣"], answer: 2 },
  { id: 'road-76', category: 'ROAD_CODE', question: '駕駛途中發現引擎水溫錶指示過高（水滾），你應：', options: ["加速以增加風冷效果", "在安全地方停車，關掉引擎，待冷卻後才檢查水箱", "立即停車並打開水箱蓋加水"], answer: 1 },
  { id: 'road-77', category: 'ROAD_CODE', question: '車輛的排氣喉冒出大量黑煙，通常表示：', options: ["機油過量", "燃油燃燒不完全或引擎需要維修", "引擎過熱"], answer: 1 },
  { id: 'road-78', category: 'ROAD_CODE', question: '安全氣袋的作用是甚麼？', options: ["代替安全帶", "配合安全帶使用，在發生猛烈碰撞時提供額外保護", "防止車輛在碰撞時翻側"], answer: 1 },
  { id: 'road-79', category: 'ROAD_CODE', question: '如果你要在車頂運載貨物，必須確保：', options: ["貨物穩固縛緊，並且不會伸出車外引起危險", "貨物用防水布遮蓋", "貨物重量不超過車輛總重"], answer: 0 },
  { id: 'road-80', category: 'ROAD_CODE', question: '車輛的倒後鏡及兩側外後視鏡的主要作用是：', options: ["觀察後座乘客", "在轉換行車線、轉彎或停車前觀察後方及側面的交通情況", "用作倒車時的唯一視線參考"], answer: 1 },
  { id: 'road-81', category: 'ROAD_CODE', question: '如你牽涉入一宗有人受傷的交通意外，你必須：', options: ["與對方司機交換資料後離開", "將傷者搬到路邊後自行離開", "立即停車，報警並留在現場等候警員到場"], answer: 2 },
  { id: 'road-82', category: 'ROAD_CODE', question: '發生交通意外（無人受傷），如車輛輕微損毀但仍可安全行駛，為避免阻塞交通，雙方司機應：', options: ["將車輛停在路中心等候警察", "立即駛離現場不作理會", "在安全情況下，將車輛駛至路邊，並交換雙方資料"], answer: 2 },
  { id: 'road-83', category: 'ROAD_CODE', question: '在交通意外中，如你不慎撞毀了政府公物（如欄杆、路牌），你必須在多長時間內向警方報告？', options: ["12小時內", "48小時內", "24小時內"], answer: 2 },
  { id: 'road-84', category: 'ROAD_CODE', question: '如你在高速公路上爆胎，你應：', options: ["立即猛力煞車停下", "緊握方向盤，慢慢減速，將車輛駛至路肩或安全地方", "在行車線中立即更換輪胎"], answer: 1 },
  { id: 'road-85', category: 'ROAD_CODE', question: '如果在平交道（鐵路交匯處）上車輛死火，警號正響起及橫杆開始降下，你應：', options: ["立即離開車輛，跑離平交道", "留在車內嘗試重新啟動引擎", "落車推車"], answer: 0 },
  { id: 'road-86', category: 'ROAD_CODE', question: '遇上車輛起火，第一步應該怎樣做？', options: ["用水撲救", "加速駛往消防局", "立即停車，關掉引擎，疏散所有乘客到安全地方並報警"], answer: 2 },
  { id: 'road-87', category: 'ROAD_CODE', question: '在處理交通意外現場時，如沒有警察在場，你應如何警告其他駛近的車輛？', options: ["在車後點火", "在意外現場前方100米處揮手", "開啟車輛的危險警告燈"], answer: 2 },
  { id: 'road-88', category: 'ROAD_CODE', question: '如發現有車輛漏出燃油或其他危險液體，你應：', options: ["不要靠近，不要點火或吸煙，並立即報警", "用泥土掩蓋", "用水沖洗"], answer: 0 },
  { id: 'road-89', category: 'ROAD_CODE', question: '意外發生後，根據法例，司機必須向警方或有合理理由要求的人提供甚麼資料？', options: ["身份證號碼及職業", "姓名、地址及車牌號碼", "保險單正本"], answer: 1 },
  { id: 'road-90', category: 'ROAD_CODE', question: '如果車輛在彎位後發生故障停下，為讓其他車輛及早察覺，你應確保危險警告標誌（如反光牌）放置在：', options: ["緊貼車尾", "車後有足夠距離（例如50米以上）", "車頂上"], answer: 1 },
  { id: 'road-91', category: 'ROAD_CODE', question: '根據違例駕駛記分制度，如兩年內累積被記滿15分，會受到甚麼處分？', options: ["須重新考取車牌", "罰款$2000", "被法庭取消駕駛資格（停牌）"], answer: 2 },
  { id: 'road-92', category: 'ROAD_CODE', question: '下列哪一項違例事項會被記最高分數（10分）？', options: ["沒有佩戴安全帶", "危險駕駛", "超速駕駛（超過限速15公里以內）"], answer: 1 },
  { id: 'road-93', category: 'ROAD_CODE', question: '在記分制下，被扣滿多少分會被強制要求修習並完成駕駛改進課程？', options: ["15分", "10分", "8分"], answer: 1 },
  { id: 'road-94', category: 'ROAD_CODE', question: '當司機的駕駛執照被暫止或取消時，他/她能否在私家路內駕駛？', options: ["不可以，在任何道路（包括私家路）駕駛均屬違法", "可以", "只可駕駛自己的車輛"], answer: 0 },
  { id: 'road-95', category: 'ROAD_CODE', question: '在單程路上倒車，根據規定是：', options: ["只能在夜間進行", "屬違法行為，除非為泊車或避免意外等必要情況", "完全合法"], answer: 1 },
  { id: 'road-96', category: 'ROAD_CODE', question: '掛上「學」字牌的私家車，可以在甚麼時間於禁止學習駕駛的區域以外練習？', options: ["只限星期日及公眾假期", "除平日上下班繁忙時間（早上7:30-9:30及下午4:30-7:30）及星期六部分時間外的非禁區時間", "任何時間"], answer: 1 },
  { id: 'road-97', category: 'ROAD_CODE', question: '暫准駕駛執照（P牌）的法定時限通常為期多久？（如無違例被延長）', options: ["24個月", "12個月", "6個月"], answer: 1 },
  { id: 'road-98', category: 'ROAD_CODE', question: 'P牌司機如觸犯一次可被記3分或以上的交通違例事項，其暫准期會被延長多久？', options: ["12個月", "6個月", "3個月"], answer: 1 },
  { id: 'road-99', category: 'ROAD_CODE', question: '如你更改了姓名或地址，必須在多少天內通知運輸署署長？', options: ["72小時內", "30天內", "14天內"], answer: 0 },
  { id: 'road-100', category: 'ROAD_CODE', question: '在駕駛時，是否容許穿著拖鞋或赤腳駕駛？', options: ["雖無法例明文禁止，但極不安全，容易導致踏錯踏板，故不建議", "完全沒有危險", "法律明文禁止"], answer: 0 }
];

export const ALL_QUESTIONS = [
  ...TAXI_REGULATIONS,
  ...PLACES,
  ...ROUTES,
  ...ROAD_CODE
];
