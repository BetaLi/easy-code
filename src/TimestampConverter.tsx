import React, { useState } from 'react';
import { Input, Button, DatePicker, Row, Col, Typography,List } from 'antd';
import moment from 'moment';
import 'moment-timezone';

const { Title, Paragraph } = Typography;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const timeZones = [
  { label: '美东 (US & Canada)', tz: 'America/New_York' },
  { label: '美西 (US & Canada)', tz: 'America/Los_Angeles' },
  { label: '墨西哥 (Russia)', tz: 'Europe/Moscow' },
  { label: '欧洲 (Germany)', tz: 'Europe/Berlin' },
  { label: '非洲 (Africa)', tz: 'Africa/Harare' },
];

// 定义时区类型
type TimeZoneDate = {
    label: string;
    date: string;
  };

const TimestampConverter = () => {
    const [timestamp, setTimestamp] = useState('');
    const [dateString, setDateString] = useState('');
    const [zoneDates, setZoneDates] = useState<TimeZoneDate[]>([]);

    const handleTimestampChange = (e: { target: { value: any; } }) => {
        setTimestamp(e.target.value);
    };


    const convertAndDisplayTimeZones = (timestampInput:any) => {
        // 确保时间戳是一个数字
        const timestamp = Number(timestampInput);
      
        // 检查时间戳是否有效
        if (!isNaN(timestamp) && (timestamp.toString().length === 10 || timestamp.toString().length === 13)) {
          // 如果时间戳长度为10位数字，假设它是以秒为单位；如果是13位数字，假设是以毫秒为单位
          const momentDate = timestamp.toString().length === 10 ?
            moment.unix(timestamp) :
            moment(timestamp);
      
          const dates = timeZones.map((zone) => ({
            label: zone.label,
            date: momentDate.tz(zone.tz).format(dateFormat),
          }));
          setZoneDates(dates);
        } else {
          // 如果无效，为所有时区设置“Invalid date”
          const invalidDates = timeZones.map((zone) => ({
            label: zone.label,
            date: 'Invalid date',
          }));
          setZoneDates(invalidDates);
        }
      };
  
    // Call this function when we need to display time zone dates
    const handleDisplayTimeZones = () => {
      if (timestamp) {
        convertAndDisplayTimeZones(timestamp);
      }
    };

    const convertToReadableDate = () => {
        // Try to detect if it's in seconds or milliseconds
        let date;
        if (timestamp.length === 10) {
            date = moment(new Date(parseInt(timestamp, 10) * 1000)).format(dateFormat) 
        } else if (timestamp.length === 13) {
            date = moment(new Date(parseInt(timestamp, 10))).format(dateFormat) ;
        } else {
            setDateString('Invalid Timestamp');
            return;
        }
        setDateString(date.toString());
        handleDisplayTimeZones()
    };

    const generateCurrentTimestamp = () => {
        const dateNow = Date.now();
        setTimestamp(dateNow.toString());
        setDateString(moment(new Date(dateNow)).format(dateFormat));
        handleDisplayTimeZones()
    };

    const handleDateChange = (date: moment.Moment, dateString: string | string[]) => {
        if (typeof dateString === 'string') {
            setDateString(dateString);
            if (date) {
                const timestamp = date.valueOf().toString(); // Convert moment object to timestamp
                setTimestamp(timestamp);
            } else {
                setTimestamp('');
                setDateString('');
            }
        }
        handleDisplayTimeZones()
    };

    const handleDateOkChange = (date: moment.Moment) => {
        if (typeof dateString === 'string') {
            setDateString(dateString);
            if (date) {
                const timestamp = date.valueOf().toString(); // Convert moment object to timestamp
                setTimestamp(timestamp);
            } else {
                setTimestamp('');
                setDateString('');
            }
        }
        handleDisplayTimeZones()
    };


    return (
        <div>
            <Title level={2}>Timestamp Converter</Title>
            <Input
                placeholder="Enter timestamp (in seconds or milliseconds)"
                value={timestamp}
                onChange={handleTimestampChange}
                style={{ marginBottom: '10px' }}
            />
            <Row gutter={12} style={{ marginBottom: '10px' }}>
                <Col span={4}>
                    <Button
                        type="primary"
                        onClick={convertToReadableDate}
                        disabled={!timestamp}
                        style={{ marginBottom: '10px', width:'100%' }}
                    >
                        转换成日期
                    </Button>
                </Col>

                <Col span={4}>
                    <Button
                        type="primary"
                        onClick={generateCurrentTimestamp}
                        style={{ width: '100%' }}
                    >
                        获取当前时间戳
                    </Button>
                </Col>

                <Col span={4}>
                    <DatePicker
                        showTime
                        format={dateFormat}
                        placeholder="Select Date and Time"
                        onChange={handleDateChange}
                        onOk={handleDateOkChange}
                        style={{ width: '100%' }}
                    />
                </Col>
                
            </Row>

            <Paragraph style={{marginTop:'30px',marginBottom:'30px', fontSize:'20px'}}>日期: {dateString}</Paragraph>

            <Title level={4}>Time Zones</Title>
                <List
                    bordered    
                    dataSource={zoneDates}
                    renderItem={(item) => (
                    <List.Item style={{fontSize:'15px'}}>
                        {item.label}: {item.date}
                    </List.Item>
                )}/>
        </div>
    );
};

export default TimestampConverter;
