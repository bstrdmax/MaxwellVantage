

import React from 'react';
import Card from '../ui/Card';
import { MOCK_CONTENT_CALENDAR } from '../../constants';
import { ContentType } from '../../types';

const ContentCalendarView: React.FC = () => {
  const daysInMonth = 31;
  const firstDayOffset = 4; // August 1, 2024 is a Thursday
  const calendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) => {
    if (i < firstDayOffset) return null;
    const day = i - firstDayOffset + 1;
    return {
      day,
      content: MOCK_CONTENT_CALENDAR.filter(c => c.publishDate.getDate() === day),
    };
  });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const contentTypeClasses: Record<ContentType, string> = {
    [ContentType.BlogPost]: 'bg-blue-500 hover:bg-blue-400',
    [ContentType.SocialMedia]: 'bg-teal-500 hover:bg-teal-400',
    [ContentType.Newsletter]: 'bg-indigo-500 hover:bg-indigo-400',
    [ContentType.Video]: 'bg-red-500 hover:bg-red-400',
  };

  return (
    <Card title="Content Calendar - August 2024">
      <div className="grid grid-cols-7 gap-px bg-gray-700 border border-gray-700 rounded-lg overflow-hidden">
        {weekdays.map(day => (
          <div key={day} className="bg-gray-800 text-center font-semibold text-gray-400 py-3 text-sm">{day}</div>
        ))}
        {calendarDays.map((dayInfo, index) => (
          <div key={index} className="h-40 bg-gray-800 p-2 overflow-y-auto relative border-t border-gray-700">
            {dayInfo && (
              <>
                <span className="text-gray-300 font-medium">{dayInfo.day}</span>
                <div className="mt-2 space-y-1">
                  {dayInfo.content.map(item => (
                    <div key={item.id} className={`p-1.5 rounded-md text-white text-xs cursor-pointer ${contentTypeClasses[item.type]}`}>
                      {item.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ContentCalendarView;
