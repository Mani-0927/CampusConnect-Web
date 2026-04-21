import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('/api/events');
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch events", error);
                setLoading(false);
            }
        };
        fetchEvents();
        // Fallback to today's date if you want standard behaviour: setCurrentDate(new Date()) 
        // Using April 2026 to match seed data visually perfectly.
    }, []);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Filter upcoming events
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = events
        .filter(event => new Date(event.date) >= today) 
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    // generate calendar grid
    const getCalendarDays = () => {
        const days = [];
        // Prev month empty days
        for (let i = firstDayIndex; i > 0; i--) {
            days.push({ day: daysInPrevMonth - i + 1, type: 'empty' });
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDayDate = new Date(year, month, i);
            const eventsOnDay = events.filter(e => {
                const eDate = new Date(e.date);
                return eDate.getFullYear() === currentDayDate.getFullYear() &&
                       eDate.getMonth() === currentDayDate.getMonth() &&
                       eDate.getDate() === currentDayDate.getDate();
            });
            days.push({ day: i, type: 'current', events: eventsOnDay });
        }
        return days;
    };

    const calendarDays = getCalendarDays();

    // Colors for dots based on type
    const getEventColor = (type) => {
        switch(type) {
            case 'Workshop': return '#3b82f6'; // blue
            case 'Hackathon': return '#ec4899'; // pink
            case 'Cultural': return '#f59e0b'; // amber
            case 'Seminar': return '#8b5cf6'; // purple
            default: return '#10b881'; // emerald
        }
    };

    return (
        <main>
            <style>{`
                .calendar-page-header { padding: 4rem 0 2rem; text-align: center; }
                .calendar-wrapper {
                    background: #0f172a; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); display: grid;
                    grid-template-columns: 350px 1fr; min-height: 600px;
                }
                @media (max-width: 900px) { .calendar-wrapper { grid-template-columns: 1fr; } }
                .calendar-sidebar { background: #1e293b; padding: 2rem; border-right: 1px solid rgba(255, 255, 255, 0.1); }
                .sidebar-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; color: #f1f5f9; }
                .upcoming-list { display: flex; flex-direction: column; gap: 1rem; }
                .mini-event-card {
                    background: #334155; padding: 1rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);
                    border-left: 4px solid var(--primary-color); transition: transform 0.2s; cursor: default;
                }
                .mini-event-card:hover { transform: translateX(5px); background: #475569; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); }
                .mini-date { font-size: 0.8rem; color: var(--primary-color); font-weight: 600; margin-bottom: 0.25rem; }
                .mini-title { font-weight: 600; color: #f1f5f9; font-size: 0.95rem; }
                .calendar-main { padding: 2rem; background: #0f172a; }
                .cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .month-title { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; }
                .cal-actions { display: flex; gap: 0.5rem; }
                .cal-btn { background: #334155; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: bold; color: #f1f5f9; }
                .cal-btn:hover { background: #475569; }
                .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem; }
                .cal-day-header { text-align: center; font-weight: 600; color: #94a3b8; padding-bottom: 0.5rem; }
                .cal-day {
                    aspect-ratio: 1; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); background: #1e293b;
                    padding: 0.5rem; position: relative; transition: all 0.2s;
                }
                .cal-day:hover { border-color: var(--primary-color); background: #334155; }
                .cal-day.active { background: #1e293b; border-color: var(--primary-color); cursor: pointer; border-width: 2px; }
                .day-number { font-weight: 600; color: #f1f5f9; }
                .event-dots-container { display: flex; gap: 4px; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); }
                .day-event-dot { width: 6px; height: 6px; border-radius: 50%; }
            `}</style>

            <section className="calendar-page-header mesh-gradient-2" style={{marginBottom: '2rem'}}>
                <div className="container">
                    <h1 style={{color: 'var(--text-main)'}}>Event Schedule</h1>
                    <p style={{color: 'var(--text-muted)'}}>Don't miss out on what's happening this month.</p>
                </div>
            </section>

            <section className="container" style={{paddingBottom: '4rem'}}>
                <div className="calendar-wrapper">
                    <aside className="calendar-sidebar">
                        <h3 className="sidebar-title">Upcoming</h3>
                        <div className="upcoming-list">
                            {loading ? (
                                <p style={{color: '#64748b'}}>Loading events...</p>
                            ) : upcomingEvents.length > 0 ? (
                                upcomingEvents.map(event => (
                                    <div key={event._id} className="mini-event-card" style={{borderLeftColor: getEventColor(event.type)}}>
                                        <div className="mini-date" style={{color: getEventColor(event.type)}}>
                                            {new Date(event.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                        </div>
                                        <div className="mini-title">{event.title}</div>
                                    </div>
                                ))
                            ) : (
                                <p style={{color: '#64748b'}}>No upcoming events.</p>
                            )}
                        </div>
                    </aside>

                    <div className="calendar-main">
                        <div className="cal-header">
                            <h2 className="month-title">{monthNames[month]} {year}</h2>
                            <div className="cal-actions">
                                <button className="cal-btn" onClick={prevMonth}>&lt;</button>
                                <button className="cal-btn" onClick={nextMonth}>&gt;</button>
                            </div>
                        </div>
                        <div className="cal-grid" id="calendar-grid">
                            <div className="cal-day-header">Sun</div>
                            <div className="cal-day-header">Mon</div>
                            <div className="cal-day-header">Tue</div>
                            <div className="cal-day-header">Wed</div>
                            <div className="cal-day-header">Thu</div>
                            <div className="cal-day-header">Fri</div>
                            <div className="cal-day-header">Sat</div>

                            {calendarDays.map((calDay, index) => (
                                <div 
                                    key={index} 
                                    className={`cal-day ${calDay.events && calDay.events.length > 0 ? 'active' : ''}`} 
                                    style={{opacity: calDay.type === 'empty' ? 0.3 : 1}}
                                    title={calDay.events && calDay.events.length > 0 ? calDay.events.map(e => e.title).join(', ') : ''}
                                >
                                    <div className="day-number">{calDay.day}</div>
                                    {calDay.events && calDay.events.length > 0 && (
                                        <div className="event-dots-container">
                                            {calDay.events.slice(0, 3).map((e, idx) => (
                                                <div key={idx} className="day-event-dot" style={{background: getEventColor(e.type)}}></div>
                                            ))}
                                            {calDay.events.length > 3 && <span style={{fontSize:'8px', color:'#94a3b8', lineHeight:'6px'}}>+</span>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
