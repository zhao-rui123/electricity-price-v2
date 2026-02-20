// 全国31省份分时电价数据
// 数据时间：2026年2月
// 执行范围：电网代理购电工商业用户
// 电价类型（价格从高到低）：尖峰 > 高峰 > 平段 > 低谷 > 深谷

export type PriceType = '尖峰' | '高峰' | '平段' | '低谷' | '深谷';

export interface TimeSlot {
  type: PriceType;
  startTime: string;
  endTime: string;
  description?: string;
}

export interface MonthData {
  month: number;
  monthName: string;
  timeSlots: TimeSlot[];
  hasPeak?: boolean;
  hasDeepValley?: boolean;
}

export interface ProvinceData {
  name: string;
  hasTimeOfUsePricing: boolean;
  note?: string;
  months: MonthData[];
}

// 电价相对比例（用于柱状图高度）
export const PRICE_RATIOS: Record<PriceType, number> = {
  '尖峰': 1.8,
  '高峰': 1.5,
  '平段': 1.0,
  '低谷': 0.5,
  '深谷': 0.3,
};

// 电价颜色配置
export const PRICE_COLORS: Record<PriceType, string> = {
  '尖峰': '#ef4444',
  '高峰': '#f97316',
  '平段': '#22c55e',
  '低谷': '#3b82f6',
  '深谷': '#6366f1',
};

// 辅助函数：创建全年统一时段
const createYearRoundData = (timeSlots: TimeSlot[]): MonthData[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: `${i + 1}月`,
    hasPeak: timeSlots.some(t => t.type === '尖峰'),
    hasDeepValley: timeSlots.some(t => t.type === '深谷'),
    timeSlots: JSON.parse(JSON.stringify(timeSlots)),
  }));
};

// 辅助函数：按月份创建数据
const createMonthData = (monthConfigs: Array<{months: number[], slots: TimeSlot[]}>): MonthData[] => {
  const result: MonthData[] = [];
  for (let m = 1; m <= 12; m++) {
    const config = monthConfigs.find(c => c.months.includes(m));
    if (config) {
      result.push({
        month: m,
        monthName: `${m}月`,
        hasPeak: config.slots.some(s => s.type === '尖峰'),
        hasDeepValley: config.slots.some(s => s.type === '深谷'),
        timeSlots: JSON.parse(JSON.stringify(config.slots)),
      });
    }
  }
  return result;
};

// 31省份数据
export const provinceData: ProvinceData[] = [
  // 1. 河南省 - 修复：尖峰时段从高峰中分离，避免重叠
  {
    name: '河南省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '17:00', endTime: '19:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '17:00', description: '高峰时段1' },
        { type: '高峰', startTime: '19:00', endTime: '24:00', description: '高峰时段2' },
        { type: '平段', startTime: '07:00', endTime: '16:00', description: '平段' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [2], slots: [
        { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
        { type: '平段', startTime: '07:00', endTime: '16:00', description: '平段' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [3, 4, 5, 9, 10, 11], slots: [
        { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [6], slots: [
        { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
        { type: '平段', startTime: '07:00', endTime: '16:00', description: '平段' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '23:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰时段1' },
        { type: '高峰', startTime: '23:00', endTime: '24:00', description: '高峰时段2' },
        { type: '平段', startTime: '07:00', endTime: '16:00', description: '平段' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 2. 云南省
  {
    name: '云南省',
    hasTimeOfUsePricing: true,
    note: '尖峰暂缓执行',
    months: createYearRoundData([
      { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
      { type: '高峰', startTime: '18:00', endTime: '24:00', description: '高峰晚间' },
      { type: '平段', startTime: '00:00', endTime: '02:00', description: '平段凌晨' },
      { type: '平段', startTime: '06:00', endTime: '07:00', description: '平段早晨' },
      { type: '平段', startTime: '09:00', endTime: '12:00', description: '平段上午' },
      { type: '平段', startTime: '16:00', endTime: '18:00', description: '平段下午' },
      { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
      { type: '低谷', startTime: '12:00', endTime: '16:00', description: '低谷中午' },
    ])
  },
  
  // 3. 江苏省
  {
    name: '江苏省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 2, 6, 7, 8, 12], slots: [
        { type: '高峰', startTime: '14:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '13:00', endTime: '14:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
      ]},
      { months: [3, 4, 5, 9, 10, 11], slots: [
        { type: '高峰', startTime: '15:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '15:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '02:00', description: '平段晚间' },
        { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '10:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 4. 安徽省 - 修复：尖峰从高峰分离、深谷从低谷分离，避免时段重叠
  {
    name: '安徽省',
    hasTimeOfUsePricing: true,
    note: '尖峰：7月15日-8月31日20:00-22:00、12月15日-1月31日19:00-21:00；深谷：每年3天及以上节假日11:00-15:00',
    months: createMonthData([
      { months: [1], slots: [
        { type: '尖峰', startTime: '19:00', endTime: '21:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '19:00', description: '高峰时段1' },
        { type: '高峰', startTime: '21:00', endTime: '24:00', description: '高峰时段2' },
        { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '13:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '02:00', endTime: '09:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
        { type: '深谷', startTime: '11:00', endTime: '15:00', description: '深谷时段（节假日）' },
      ]},
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰时段1' },
        { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰时段2' },
        { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '13:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '02:00', endTime: '09:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
        { type: '深谷', startTime: '11:00', endTime: '15:00', description: '深谷时段（节假日）' },
      ]},
      { months: [9, 12], slots: [
        { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
        { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '13:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '02:00', endTime: '09:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
        { type: '深谷', startTime: '11:00', endTime: '15:00', description: '深谷时段（节假日）' },
      ]},
      { months: [2, 3, 4, 5, 6, 10, 11], slots: [
        { type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' },
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
        { type: '低谷', startTime: '23:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '深谷', startTime: '11:00', endTime: '15:00', description: '深谷时段（节假日）' },
      ]},
    ])
  },
  
  // 5. 广东省（珠三角五市）- 修复：7-9月有尖峰，其他月份无尖峰，补充12:00-14:00平段
  {
    name: '广东省（珠三角五市）',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' },
        { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' },
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '14:00', description: '平段中午' },
        { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 3, 4, 5, 6, 10, 11, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '14:00', description: '平段中午' },
        { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 6. 山东省 - 修复：尖峰从高峰分离，避免重叠
  {
    name: '山东省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '17:00', endTime: '22:00', description: '尖峰时段' },
        { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' },
        { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午1' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' },
        { type: '低谷', startTime: '23:00', endTime: '02:00', description: '低谷深夜' },
      ]},
      { months: [2], slots: [
        { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' },
        { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午1' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' },
        { type: '低谷', startTime: '23:00', endTime: '02:00', description: '低谷深夜' },
      ]},
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '17:00', endTime: '22:00', description: '尖峰时段' },
        { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' },
        { type: '平段', startTime: '16:00', endTime: '17:00', description: '平段下午1' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '09:00', endTime: '16:00', description: '低谷白天' },
        { type: '低谷', startTime: '23:00', endTime: '02:00', description: '低谷深夜' },
      ]},
      { months: [3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰时段' },
        { type: '平段', startTime: '07:00', endTime: '09:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '02:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '09:00', endTime: '14:00', description: '低谷白天' },
        { type: '低谷', startTime: '23:00', endTime: '02:00', description: '低谷深夜' },
      ]},
    ])
  },
  
  // 7. 山西省
  {
    name: '山西省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
      ]},
      { months: [1, 12], slots: [
        { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰时段' },
        { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
      ]},
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 8. 北京市 - 修复：补充所有月份，尖峰从高峰分离避免重叠
  {
    name: '北京市',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '11:00', endTime: '13:00', description: '尖峰时段1' },
        { type: '尖峰', startTime: '16:00', endTime: '17:00', description: '尖峰时段2' },
        { type: '高峰', startTime: '10:00', endTime: '11:00', description: '高峰上午1' },
        { type: '高峰', startTime: '13:00', endTime: '16:00', description: '高峰下午' },
        { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '21:00', description: '尖峰时段' },
        { type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '18:00', description: '高峰下午1' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '10:00', endTime: '13:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '13:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 9. 河北省（北网）
  {
    name: '河北省（北网）',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [6, 7, 8], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '13:00', endTime: '17:00', description: '高峰下午' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '11:00', endTime: '13:00', description: '平段中午' },
        { type: '平段', startTime: '17:00', endTime: '21:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 12], slots: [
        { type: '高峰', startTime: '17:00', endTime: '19:00', description: '高峰下午1' },
        { type: '高峰', startTime: '21:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '17:00', description: '平段白天' },
        { type: '平段', startTime: '19:00', endTime: '21:00', description: '平段傍晚' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [3, 4, 5, 9, 10, 11], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午' },
        { type: '高峰', startTime: '21:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '11:00', endTime: '16:00', description: '平段白天' },
        { type: '平段', startTime: '18:00', endTime: '21:00', description: '平段傍晚' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 10. 河北省（南网）
  {
    name: '河北省（南网）',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [3, 4, 5], slots: [
        { type: '深谷', startTime: '12:00', endTime: '15:00', description: '深谷时段' },
        { type: '低谷', startTime: '03:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '12:00', description: '低谷中午' },
        { type: '平段', startTime: '00:00', endTime: '03:00', description: '平段深夜' },
        { type: '平段', startTime: '07:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '15:00', endTime: '16:00', description: '平段下午' },
        { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
      ]},
      { months: [6, 7, 8], slots: [
        { type: '尖峰', startTime: '19:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '19:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '01:00', description: '平段深夜' },
        { type: '平段', startTime: '07:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '01:00', endTime: '07:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [9, 10, 11], slots: [
        { type: '深谷', startTime: '12:00', endTime: '14:00', description: '深谷时段' },
        { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '12:00', description: '低谷中午1' },
        { type: '低谷', startTime: '14:00', endTime: '15:00', description: '低谷中午2' },
        { type: '平段', startTime: '00:00', endTime: '02:00', description: '平段深夜' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '15:00', endTime: '16:00', description: '平段下午' },
        { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
      ]},
      { months: [1, 2, 12], slots: [
        { type: '尖峰', startTime: '17:00', endTime: '19:00', description: '尖峰时段' },
        { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '02:00', description: '平段深夜' },
        { type: '平段', startTime: '06:00', endTime: '07:00', description: '平段早晨' },
        { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '15:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜2' },
        { type: '低谷', startTime: '02:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '15:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 11. 冀北地区
  {
    name: '冀北地区',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [6, 7, 8], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '21:00', description: '尖峰时段' },
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '16:00', description: '平段中午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [1, 11, 12], slots: [
        { type: '尖峰', startTime: '17:00', endTime: '19:00', description: '尖峰时段' },
        { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '17:00', description: '高峰下午' },
        { type: '高峰', startTime: '19:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '07:00', description: '平段凌晨' },
        { type: '平段', startTime: '09:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '07:00', endTime: '09:00', description: '低谷早晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
        { type: '深谷', startTime: '12:00', endTime: '15:00', description: '深谷时段' },
      ]},
      { months: [2, 3, 4, 5, 9, 10], slots: [
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '00:00', endTime: '01:00', description: '平段深夜' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '15:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜2' },
        { type: '低谷', startTime: '01:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '15:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 12. 浙江省
  {
    name: '浙江省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '13:00', endTime: '17:00', description: '高峰下午' },
        { type: '平段', startTime: '17:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
      ]},
      { months: [1, 7, 8, 12], slots: [
        { type: '尖峰', startTime: '09:00', endTime: '11:00', description: '尖峰上午' },
        { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰下午' },
        { type: '高峰', startTime: '08:00', endTime: '09:00', description: '高峰早晨' },
        { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '13:00', endTime: '15:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '13:00', description: '低谷中午' },
        { type: '深谷', startTime: '10:00', endTime: '14:00', description: '深谷时段（节假日）' },
      ]},
    ])
  },
  
  // 13. 上海市 - 修复：尖峰从高峰分离，避免重叠
  {
    name: '上海市',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '12:00', endTime: '14:00', description: '尖峰时段' },
        { type: '高峰', startTime: '08:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '14:00', endTime: '15:00', description: '高峰下午1' },
        { type: '高峰', startTime: '18:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '15:00', endTime: '18:00', description: '平段下午' },
        { type: '平段', startTime: '21:00', endTime: '22:00', description: '平段晚间' },
        { type: '低谷', startTime: '22:00', endTime: '06:00', description: '低谷时段' },
      ]},
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '19:00', endTime: '21:00', description: '尖峰时段' },
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '18:00', endTime: '19:00', description: '高峰下午1' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '11:00', endTime: '18:00', description: '平段白天' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '22:00', endTime: '24:00', description: '低谷深夜' },
      ]},
      { months: [2, 3, 4, 5, 6, 10, 11], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '18:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '11:00', endTime: '18:00', description: '平段白天' },
        { type: '平段', startTime: '21:00', endTime: '22:00', description: '平段晚间' },
        { type: '低谷', startTime: '22:00', endTime: '06:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 14. 四川省
  {
    name: '四川省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [3, 4, 5, 6, 10, 11], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '08:00', description: '平段夜间' },
        { type: '低谷', startTime: '22:00', endTime: '08:00', description: '低谷时段' },
      ]},
      { months: [7, 8, 9], slots: [
        { type: '高峰', startTime: '11:00', endTime: '18:00', description: '高峰白天' },
        { type: '高峰', startTime: '20:00', endTime: '23:00', description: '高峰晚间' },
        { type: '平段', startTime: '07:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '18:00', endTime: '20:00', description: '平段傍晚' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [1, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 15. 黑龙江省
  {
    name: '黑龙江省',
    hasTimeOfUsePricing: true,
    note: '尖峰电价暂停执行',
    months: createYearRoundData([
      { type: '高峰', startTime: '07:00', endTime: '08:00', description: '高峰早晨' },
      { type: '高峰', startTime: '09:00', endTime: '11:30', description: '高峰上午' },
      { type: '高峰', startTime: '15:30', endTime: '20:00', description: '高峰下午' },
      { type: '平段', startTime: '08:00', endTime: '09:00', description: '平段上午' },
      { type: '平段', startTime: '11:30', endTime: '12:00', description: '平段中午' },
      { type: '平段', startTime: '14:00', endTime: '15:30', description: '平段下午' },
      { type: '平段', startTime: '20:00', endTime: '23:30', description: '平段晚间' },
      { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      { type: '低谷', startTime: '23:30', endTime: '05:30', description: '低谷凌晨' },
      { type: '平段', startTime: '05:30', endTime: '07:00', description: '平段早晨' },
    ])
  },
  
  // 16. 辽宁省 - 不执行分时电价
  {
    name: '辽宁省',
    hasTimeOfUsePricing: false,
    note: '2025年3月1日起开展电力现货市场连续结算试运行，实际购电价格按市场价格结算，不执行固定分时电价',
    months: []
  },
  
  // 17. 吉林省
  {
    name: '吉林省',
    hasTimeOfUsePricing: true,
    note: '尖峰电价调整为灵活启动机制',
    months: createYearRoundData([
      { type: '高峰', startTime: '08:00', endTime: '10:00', description: '高峰上午' },
      { type: '高峰', startTime: '16:00', endTime: '21:00', description: '高峰晚间' },
      { type: '平段', startTime: '05:00', endTime: '08:00', description: '平段早晨' },
      { type: '平段', startTime: '10:00', endTime: '11:00', description: '平段上午' },
      { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
      { type: '平段', startTime: '21:00', endTime: '23:00', description: '平段晚间' },
      { type: '低谷', startTime: '00:00', endTime: '05:00', description: '低谷凌晨' },
      { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
      { type: '低谷', startTime: '23:00', endTime: '24:00', description: '低谷深夜' },
    ])
  },
  
  // 18. 内蒙古东部 - 修复：尖峰从高峰分离，避免重叠
  {
    name: '内蒙古东部',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [6, 7, 8], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '20:00', description: '尖峰时段' },
        { type: '高峰', startTime: '06:00', endTime: '09:00', description: '高峰上午' },
        { type: '高峰', startTime: '17:00', endTime: '18:00', description: '高峰下午1' },
        { type: '高峰', startTime: '20:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '05:00', endTime: '06:00', description: '平段早晨' },
        { type: '平段', startTime: '09:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
        { type: '低谷', startTime: '00:00', endTime: '05:00', description: '低谷凌晨' },
        { type: '深谷', startTime: '12:00', endTime: '14:00', description: '深谷时段' },
      ]},
      { months: [1, 11, 12], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '平段', startTime: '21:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷时段' },
      ]},
      { months: [2, 3, 4, 5, 6, 7, 8, 9, 10], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '24:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 19. 内蒙古西部（蒙西）
  {
    name: '内蒙古西部（蒙西）',
    hasTimeOfUsePricing: true,
    months: createYearRoundData([
      { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
      { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
      { type: '平段', startTime: '00:00', endTime: '07:00', description: '平段凌晨' },
      { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
      { type: '低谷', startTime: '09:00', endTime: '17:00', description: '低谷白天' },
    ])
  },
  
  // 20. 江西省 - 修复：尖峰从高峰分离，避免重叠
  {
    name: '江西省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '20:00', description: '尖峰时段' },
        { type: '高峰', startTime: '09:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '20:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '09:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '18:00', description: '平段下午' },
        { type: '平段', startTime: '21:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷时段' },
      ]},
      { months: [2], slots: [
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '16:00', description: '平段白天' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷时段' },
      ]},
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '20:30', endTime: '22:30', description: '尖峰时段' },
        { type: '高峰', startTime: '17:00', endTime: '20:30', description: '高峰下午' },
        { type: '高峰', startTime: '22:30', endTime: '23:00', description: '高峰深夜' },
        { type: '平段', startTime: '05:00', endTime: '11:30', description: '平段上午' },
        { type: '平段', startTime: '14:30', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '01:00', endTime: '05:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:30', endTime: '14:30', description: '低谷中午' },
        { type: '深谷', startTime: '12:00', endTime: '14:00', description: '深谷时段' },
      ]},
      { months: [3, 4, 5, 6, 10, 11], slots: [
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰时段' },
        { type: '平段', startTime: '05:00', endTime: '11:30', description: '平段上午' },
        { type: '平段', startTime: '14:30', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '01:00', endTime: '05:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:30', endTime: '14:30', description: '低谷中午' },
        { type: '深谷', startTime: '12:00', endTime: '14:00', description: '深谷时段' },
      ]},
    ])
  },
  
  // 21. 湖北省
  {
    name: '湖北省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰深夜' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12], slots: [
        { type: '高峰', startTime: '18:00', endTime: '20:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '18:00', description: '平段下午' },
        { type: '平段', startTime: '20:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 22. 湖南省
  {
    name: '湖南省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰深夜' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '24:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '16:00', endTime: '24:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 23. 青海省
  {
    name: '青海省',
    hasTimeOfUsePricing: true,
    months: createYearRoundData([
      { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
      { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
      { type: '平段', startTime: '00:00', endTime: '07:00', description: '平段凌晨' },
      { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
      { type: '低谷', startTime: '09:00', endTime: '17:00', description: '低谷白天' },
    ])
  },
  
  // 24. 宁夏回族自治区
  {
    name: '宁夏回族自治区',
    hasTimeOfUsePricing: true,
    months: createYearRoundData([
      { type: '高峰', startTime: '07:00', endTime: '09:00', description: '高峰上午' },
      { type: '高峰', startTime: '17:00', endTime: '23:00', description: '高峰晚间' },
      { type: '平段', startTime: '00:00', endTime: '07:00', description: '平段凌晨' },
      { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
      { type: '低谷', startTime: '09:00', endTime: '17:00', description: '低谷白天' },
    ])
  },
  
  // 25. 陕西省（不含榆林）
  {
    name: '陕西省（不含榆林）',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '19:00', endTime: '21:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '23:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [1, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '20:00', description: '尖峰时段' },
        { type: '高峰', startTime: '16:00', endTime: '23:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [2, 3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '16:00', endTime: '23:00', description: '高峰时段' },
        { type: '平段', startTime: '06:00', endTime: '11:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '11:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 26. 天津市 - 修复：尖峰从高峰分离，避免重叠
  {
    name: '天津市',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '15:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '23:00', description: '高峰深夜' },
        { type: '平段', startTime: '00:00', endTime: '01:00', description: '平段深夜' },
        { type: '平段', startTime: '09:00', endTime: '15:00', description: '平段白天' },
        { type: '平段', startTime: '23:00', endTime: '24:00', description: '平段深夜2' },
        { type: '低谷', startTime: '01:00', endTime: '09:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 12], slots: [
        { type: '尖峰', startTime: '18:00', endTime: '20:00', description: '尖峰时段' },
        { type: '高峰', startTime: '08:00', endTime: '10:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '18:00', description: '高峰下午1' },
        { type: '高峰', startTime: '20:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '10:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
      { months: [3, 4, 5, 6, 9, 10, 11], slots: [
        { type: '高峰', startTime: '08:00', endTime: '10:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '06:00', endTime: '08:00', description: '平段早晨' },
        { type: '平段', startTime: '10:00', endTime: '12:00', description: '平段上午' },
        { type: '平段', startTime: '14:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '06:00', description: '低谷凌晨' },
        { type: '低谷', startTime: '12:00', endTime: '14:00', description: '低谷中午' },
      ]},
    ])
  },
  
  // 27. 甘肃省
  {
    name: '甘肃省',
    hasTimeOfUsePricing: true,
    months: createYearRoundData([
      { type: '高峰', startTime: '06:00', endTime: '08:00', description: '高峰早晨' },
      { type: '高峰', startTime: '18:00', endTime: '23:00', description: '高峰晚间' },
      { type: '平段', startTime: '23:00', endTime: '06:00', description: '平段夜间' },
      { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
      { type: '平段', startTime: '16:00', endTime: '18:00', description: '平段下午' },
      { type: '低谷', startTime: '10:00', endTime: '16:00', description: '低谷白天' },
    ])
  },
  
  // 28. 新疆维吾尔自治区
  {
    name: '新疆维吾尔自治区',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [5, 6, 7, 8], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '24:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷凌晨' },
        { type: '深谷', startTime: '14:00', endTime: '16:00', description: '深谷时段' },
      ]},
      { months: [1, 11, 12], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '21:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '平段', startTime: '21:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷凌晨' },
      ]},
      { months: [2, 3, 4, 9, 10], slots: [
        { type: '高峰', startTime: '08:00', endTime: '11:00', description: '高峰上午' },
        { type: '高峰', startTime: '19:00', endTime: '24:00', description: '高峰晚间' },
        { type: '平段', startTime: '00:00', endTime: '08:00', description: '平段凌晨' },
        { type: '平段', startTime: '11:00', endTime: '19:00', description: '平段白天' },
        { type: '低谷', startTime: '00:00', endTime: '04:00', description: '低谷凌晨' },
      ]},
    ])
  },
  
  // 29. 海南省
  {
    name: '海南省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [5, 6, 7], slots: [
        { type: '尖峰', startTime: '20:00', endTime: '22:00', description: '尖峰时段' },
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '22:00', endTime: '24:00', description: '高峰深夜' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 3, 4, 8, 9, 10, 11, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '16:00', endTime: '22:00', description: '高峰下午' },
        { type: '平段', startTime: '07:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '16:00', description: '平段下午' },
        { type: '平段', startTime: '22:00', endTime: '23:00', description: '平段晚间' },
        { type: '低谷', startTime: '23:00', endTime: '07:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 30. 贵州省
  {
    name: '贵州省',
    hasTimeOfUsePricing: true,
    months: createYearRoundData([
      { type: '高峰', startTime: '10:00', endTime: '11:00', description: '高峰上午' },
      { type: '高峰', startTime: '17:00', endTime: '22:00', description: '高峰晚间' },
      { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
      { type: '平段', startTime: '11:00', endTime: '13:00', description: '平段中午' },
      { type: '平段', startTime: '15:00', endTime: '17:00', description: '平段下午' },
      { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
      { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷凌晨' },
      { type: '低谷', startTime: '13:00', endTime: '15:00', description: '低谷中午' },
    ])
  },
  
  // 31. 深圳市 - 修复：7-9月有尖峰，其他月份无尖峰，补充12:00-14:00平段
  {
    name: '深圳市',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' },
        { type: '尖峰', startTime: '15:00', endTime: '17:00', description: '尖峰时段2' },
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '14:00', description: '平段中午' },
        { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 3, 4, 5, 6, 10, 11, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '14:00', endTime: '19:00', description: '高峰下午' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '14:00', description: '平段中午' },
        { type: '平段', startTime: '19:00', endTime: '24:00', description: '平段晚间' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 32. 福建省 - 修复：尖峰从高峰分离，避免重叠
  {
    name: '福建省',
    hasTimeOfUsePricing: true,
    months: createMonthData([
      { months: [7, 8, 9], slots: [
        { type: '尖峰', startTime: '11:00', endTime: '12:00', description: '尖峰时段1' },
        { type: '尖峰', startTime: '17:00', endTime: '18:00', description: '尖峰时段2' },
        { type: '高峰', startTime: '10:00', endTime: '11:00', description: '高峰上午1' },
        { type: '高峰', startTime: '12:00', endTime: '15:00', description: '高峰下午1' },
        { type: '高峰', startTime: '18:00', endTime: '20:00', description: '高峰下午2' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '15:00', endTime: '17:00', description: '平段下午' },
        { type: '平段', startTime: '20:00', endTime: '21:00', description: '平段傍晚' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
      { months: [1, 2, 3, 4, 5, 6, 10, 11, 12], slots: [
        { type: '高峰', startTime: '10:00', endTime: '12:00', description: '高峰上午' },
        { type: '高峰', startTime: '15:00', endTime: '20:00', description: '高峰下午' },
        { type: '高峰', startTime: '21:00', endTime: '22:00', description: '高峰晚间' },
        { type: '平段', startTime: '08:00', endTime: '10:00', description: '平段上午' },
        { type: '平段', startTime: '12:00', endTime: '15:00', description: '平段中午' },
        { type: '平段', startTime: '20:00', endTime: '21:00', description: '平段傍晚' },
        { type: '平段', startTime: '22:00', endTime: '24:00', description: '平段深夜' },
        { type: '低谷', startTime: '00:00', endTime: '08:00', description: '低谷时段' },
      ]},
    ])
  },
  
  // 不执行分时电价的省份
  {
    name: '西藏自治区',
    hasTimeOfUsePricing: false,
    note: '全区执行统一电价，不实行分时电价政策',
    months: []
  },
  {
    name: '重庆市',
    hasTimeOfUsePricing: false,
    note: '不实行分时电价政策',
    months: []
  },
  {
    name: '广西壮族自治区',
    hasTimeOfUsePricing: false,
    note: '不实行分时电价政策',
    months: []
  },
];

// 获取省份列表
export const getProvinceList = (): string[] => {
  return provinceData.map(p => p.name);
};

// 获取省份数据
export const getProvinceData = (provinceName: string): ProvinceData | undefined => {
  return provinceData.find(p => p.name === provinceName);
};

// 获取月份数据
export const getMonthData = (provinceName: string, month: number): MonthData | undefined => {
  const province = getProvinceData(provinceName);
  if (!province) return undefined;
  return province.months.find(m => m.month === month);
};

// 获取所有月份选项
export const monthOptions = [
  { value: 1, label: '1月' },
  { value: 2, label: '2月' },
  { value: 3, label: '3月' },
  { value: 4, label: '4月' },
  { value: 5, label: '5月' },
  { value: 6, label: '6月' },
  { value: 7, label: '7月' },
  { value: 8, label: '8月' },
  { value: 9, label: '9月' },
  { value: 10, label: '10月' },
  { value: 11, label: '11月' },
  { value: 12, label: '12月' },
];
