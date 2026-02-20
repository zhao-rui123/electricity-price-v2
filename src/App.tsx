import { useState, useMemo } from 'react';
import { provinceData, PRICE_RATIOS, PRICE_COLORS, type PriceType, type ProvinceData } from './data/electricityPriceData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function App() {
  const [selectedProvince, setSelectedProvince] = useState(provinceData[0]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProvinces = useMemo(() => {
    return provinceData.filter(p => p.name.includes(searchTerm));
  }, [searchTerm]);

  const monthData = useMemo(() => {
    return selectedProvince.months.find(m => m.month === selectedMonth);
  }, [selectedProvince, selectedMonth]);

  const chartData = useMemo(() => {
    if (!monthData) return [];
    return monthData.timeSlots.map(slot => ({
      name: slot.description || slot.type,
      type: slot.type,
      value: PRICE_RATIOS[slot.type],
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));
  }, [monthData]);

  const getPriceColor = (type: PriceType) => PRICE_COLORS[type];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}>
            ⚡ 全国31省分时电价查询
          </h1>
          <p style={{ color: '#94a3b8' }}>电网代理购电工商业用户分时电价</p>
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '300px 1fr', 
          gap: '30px',
          alignItems: 'start'
        }}>
          <!-- 左侧选择面板 -->
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>搜索省份</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="输入省份名称..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>选择省份</label>
              <select
                value={selectedProvince.name}
                onChange={(e) => {
                  const p = provinceData.find(p => p.name === e.target.value);
                  if (p) setSelectedProvince(p);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                {filteredProvinces.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>选择月份</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  fontSize: '14px'
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}月</option>
                ))}
              </select>
            </div>

            {selectedProvince.note && (
              <div style={{ 
                marginTop: '20px', 
                padding: '12px', 
                background: 'rgba(234, 179, 8, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                fontSize: '13px',
                color: '#eab308'
              }}>
                📌 {selectedProvince.note}
              </div>
            )}
          </div>

          <!-- 右侧图表 -->
          <div>
            {!selectedProvince.hasTimeOfUsePricing ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏠</div>
                <h2>{selectedProvince.name}</h2>
                <p style={{ color: '#94a3b8', marginTop: '10px' }}>该省份不实行分时电价政策</p>
              </div>
            ) : monthData ? (
              <div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
003e
                  <h2 style={{ marginBottom: '20px' }}>
                    {selectedProvince.name} - {selectedMonth}月分时电价
                  </h2>
                  
                  <div style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          tick={{ fill: '#94a3b8' }}
                          label={{ value: '电价相对比例', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                          formatter={(value: number, name: string, props: any) => {
                            const data = props.payload;
                            return [
                              `电价比例: ${value}`,
                              `${data.type}`,
                              `时间: ${data.startTime} - ${data.endTime}`
                            ];
                          }}
                        />
                        
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getPriceColor(entry.type)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  {monthData.timeSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderLeft: `4px solid ${getPriceColor(slot.type)}`
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ 
                          fontWeight: 'bold',
                          color: getPriceColor(slot.type)
                        }}>
                          {slot.type}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '14px' }}>
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                        {slot.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                该月份暂无数据
              </div>
            )}
          </div>
        </div>

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          color: '#64748b'
        }}>
          <p>数据时间：2026年2月 | 执行范围：电网代理购电工商业用户</p>
          <p style={{ marginTop: '10px', fontSize: '12px' }}>
            电价类型（从高到低）：尖峰 > 高峰 > 平段 > 低谷 > 深谷
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
