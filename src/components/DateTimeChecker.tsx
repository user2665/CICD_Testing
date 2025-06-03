import React, { useState, useEffect } from 'react';
import { format, parseISO, differenceInMinutes, formatDistanceToNow } from 'date-fns';
import './DateTimeChecker.css';

interface TimeZoneOption {
  label: string;
  value: string;
}

interface DateValidationResult {
  isValid: boolean;
}

const timeZones: TimeZoneOption[] = [
  { label: 'UTC', value: 'UTC' },
  { label: 'New York (EST)', value: 'America/New_York' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' }
];

const validateDate = (dateStr: string): DateValidationResult => {
  if (!dateStr) {
    return { isValid: false };
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const currentYear = new Date().getFullYear();

  // Check year range (1000 to current year)
  if (year < 1000 || year > currentYear) {
    return { isValid: false };
  }

  // Check month range
  if (month < 1 || month > 12) {
    return { isValid: false };
  }

  // Calculate days in month (accounting for leap years)
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonth = [
    31, // January
    isLeapYear ? 29 : 28, // February
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31  // December
  ];

  // Check day range
  if (day < 1 || day > daysInMonth[month - 1]) {
    return { isValid: false };
  }

  return { isValid: true };
};

const DateTimeChecker: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>('UTC');
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(format(now, 'MMMM dd, yyyy HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const showError = () => {
    setPopupMessage('date is not valid');
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const checkDateTime = () => {
    if (!date || !time) {
      showError();
      return;
    }

    const dateValidation = validateDate(date);
    if (!dateValidation.isValid) {
      showError();
      return;
    }

    const inputDateTime = new Date(`${date}T${time}`);
    if (isNaN(inputDateTime.getTime())) {
      showError();
      return;
    }

    const now = new Date();
    const diffInMinutes = differenceInMinutes(inputDateTime, now);
    const relativeTime = formatDistanceToNow(inputDateTime, { addSuffix: true });
    
    setResult(`
      Selected date and time is ${relativeTime}
      (${Math.abs(diffInMinutes)} minutes ${diffInMinutes > 0 ? 'in the future' : 'in the past'})
    `);
  };

  const convertTimeZone = () => {
    if (!date || !time) {
      showError();
      return;
    }

    const dateValidation = validateDate(date);
    if (!dateValidation.isValid) {
      showError();
      return;
    }

    try {
      const inputDateTime = new Date(`${date}T${time}`);
      const formattedDate = inputDateTime.toLocaleString('en-US', {
        timeZone: selectedTimeZone,
        dateStyle: 'full',
        timeStyle: 'long'
      });
      setResult(`Time in ${selectedTimeZone}: ${formattedDate}`);
    } catch {
      showError();
    }
  };

  const formatDate = () => {
    if (!date) {
      showError();
      return;
    }

    const dateValidation = validateDate(date);
    if (!dateValidation.isValid) {
      showError();
      return;
    }

    try {
      const inputDate = parseISO(date);
      const formats = [
        format(inputDate, 'MMMM dd, yyyy'),
        format(inputDate, 'MM/dd/yyyy'),
        format(inputDate, 'dd-MM-yyyy'),
        format(inputDate, 'yyyy-MM-dd'),
        format(inputDate, 'EEEE, MMMM do, yyyy')
      ];

      setResult('Formatted dates:\n' + formats.join('\n'));
    } catch {
      showError();
    }
  };

  return (
    <div className="datetime-checker">
      <h1>Date Time Checker</h1>
      
      {showPopup && (
        <div className="popup-message">
          {popupMessage}
        </div>
      )}

      <div className="current-time">
        <h2>Current Date & Time:</h2>
        <div className="time-display">{currentDateTime}</div>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="dateInput">Date:</label>
          <input
            type="date"
            id="dateInput"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="timeInput">Time:</label>
          <input
            type="time"
            id="timeInput"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="timezoneSelect">Time Zone:</label>
          <select
            id="timezoneSelect"
            value={selectedTimeZone}
            onChange={(e) => setSelectedTimeZone(e.target.value)}
          >
            {timeZones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="button-group">
        <button onClick={checkDateTime}>Check Date & Time</button>
        <button onClick={convertTimeZone}>Convert Time Zone</button>
        <button onClick={formatDate}>Format Date</button>
      </div>

      <div className="result-section">
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default DateTimeChecker; 