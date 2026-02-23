// ═══════════════════════════════════════════════
// 📁 src/views/centre/CentreCalendar.js
// ═══════════════════════════════════════════════

import React, { useState } from "react";

export default function CentreCalendar() {
  const [events, setEvents] = useState([
    { id: 1, title: "React Advanced - Session 1", date: "2025-01-20", time: "09:00", type: "session", color: "bg-lightBlue-500" },
    { id: 2, title: "Node.js API - Exam", date: "2025-01-22", time: "14:00", type: "exam", color: "bg-red-500" },
    { id: 3, title: "Python ML - Workshop", date: "2025-01-25", time: "10:00", type: "workshop", color: "bg-emerald-500" },
    { id: 4, title: "React Advanced - Session 2", date: "2025-01-27", time: "09:00", type: "session", color: "bg-lightBlue-500" },
    { id: 5, title: "Open Day", date: "2025-01-30", time: "08:00", type: "event", color: "bg-purple-500" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", type: "session" });

  const typeColors = { session: "bg-lightBlue-500", exam: "bg-red-500", workshop: "bg-emerald-500", event: "bg-purple-500" };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, { ...newEvent, id: Date.now(), color: typeColors[newEvent.type] }]);
    setShowModal(false);
    setNewEvent({ title: "", date: "", time: "", type: "session" });
  };

  const deleteEvent = (id) => {
    if (window.confirm("Delete this event?")) setEvents(events.filter((e) => e.id !== id));
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="pb-8">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blueGray-800">
          <i className="fas fa-calendar-alt text-lightBlue-500 mr-2"></i>Calendar & Events
        </h2>
        <button onClick={() => setShowModal(true)} className="bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-600">
          <i className="fas fa-plus mr-1"></i>Add Event
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(typeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="text-sm text-blueGray-600 capitalize">{type}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b">
            <h3 className="font-bold text-blueGray-700"><i className="fas fa-clock text-amber-500 mr-2"></i>Upcoming Events</h3>
          </div>
          <div className="p-4">
            {sortedEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 mb-2 rounded-lg border hover:bg-blueGray-50">
                <div className={`w-2 h-12 rounded-full ${event.color}`}></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{event.title}</p>
                  <p className="text-xs text-blueGray-400">
                    <i className="fas fa-calendar mr-1"></i>{event.date}
                    {event.time && <span className="ml-2"><i className="fas fa-clock mr-1"></i>{event.time}</span>}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${event.color}`}>{event.type}</span>
                <button onClick={() => deleteEvent(event.id)} className="text-blueGray-300 hover:text-red-500">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="bg-white rounded-lg shadow-lg p-4">
                <p className="text-xs text-blueGray-400 font-bold uppercase capitalize">{type}s</p>
                <p className="text-2xl font-bold text-blueGray-700">{events.filter((e) => e.type === type).length}</p>
              </div>
            ))}
          </div>
          {sortedEvents.length > 0 && (
            <div className="bg-gradient-to-r from-lightBlue-500 to-lightBlue-700 rounded-lg shadow-lg p-6 text-white">
              <p className="text-sm font-bold opacity-80 mb-1">NEXT EVENT</p>
              <h4 className="text-xl font-bold mb-2">{sortedEvents[0].title}</h4>
              <p className="text-sm opacity-80"><i className="fas fa-calendar mr-1"></i>{sortedEvents[0].date}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowModal(false)}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Add Event</h3>
                <button onClick={() => setShowModal(false)} className="text-blueGray-400 hover:text-red-500"><i className="fas fa-times text-xl"></i></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">Title</label>
                  <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500" placeholder="Event title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blueGray-600 text-sm font-bold mb-2">Date</label>
                    <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500" />
                  </div>
                  <div>
                    <label className="block text-blueGray-600 text-sm font-bold mb-2">Time</label>
                    <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-blueGray-600 text-sm font-bold mb-2">Type</label>
                  <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="border rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500">
                    <option value="session">📚 Session</option>
                    <option value="exam">📝 Exam</option>
                    <option value="workshop">🔧 Workshop</option>
                    <option value="event">🎉 Event</option>
                  </select>
                </div>
              </div>
              <div className="px-6 py-4 border-t flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="bg-red-500 text-white font-bold text-sm px-6 py-3 rounded shadow">Cancel</button>
                <button onClick={addEvent} className="bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded shadow">Add Event</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}