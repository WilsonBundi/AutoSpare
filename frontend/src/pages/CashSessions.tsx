import { useState, useEffect } from 'react';
import { cashSessionService, CashSession } from '../services/cashSessionService';

const CashSessions = () => {
  const [sessions, setSessions] = useState<CashSession[]>([]);
  const [activeSession, setActiveSession] = useState<CashSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [formData, setFormData] = useState({
    opening_balance: '',
    closing_balance: '',
    notes: '',
  });

  useEffect(() => {
    fetchSessions();
    fetchActiveSession();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await cashSessionService.getAll();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSession = async () => {
    try {
      const data = await cashSessionService.getActiveSession();
      setActiveSession(data);
    } catch (error) {
      console.error('Failed to fetch active session:', error);
    }
  };

  const handleOpenSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cashSessionService.openSession(parseFloat(formData.opening_balance), formData.notes);
      setShowOpenModal(false);
      setFormData({ opening_balance: '', closing_balance: '', notes: '' });
      fetchSessions();
      fetchActiveSession();
    } catch (error) {
      alert('Failed to open session');
    }
  };

  const handleCloseSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;

    try {
      await cashSessionService.closeSession(activeSession.id!, parseFloat(formData.closing_balance), formData.notes);
      setShowCloseModal(false);
      setFormData({ opening_balance: '', closing_balance: '', notes: '' });
      fetchSessions();
      fetchActiveSession();
    } catch (error) {
      alert('Failed to close session');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cash Sessions</h1>
          <p className="text-gray-500 mt-1">Track cash drawer opening and closing</p>
        </div>
        {activeSession ? (
          <button
            onClick={() => setShowCloseModal(true)}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Close Session</span>
          </button>
        ) : (
          <button
            onClick={() => setShowOpenModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Open Session</span>
          </button>
        )}
      </div>

      {/* Active Session Card */}
      {activeSession && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Active Session</h2>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Started At</p>
              <p className="font-bold text-lg">{new Date(activeSession.session_start!).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Opening Balance</p>
              <p className="font-bold text-lg">KES {parseFloat(activeSession.opening_balance || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">User</p>
              <p className="font-bold text-lg">{activeSession.user_name}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Duration</p>
              <p className="font-bold text-lg">
                {activeSession.session_start &&
                  Math.floor((Date.now() - new Date(activeSession.session_start).getTime()) / 60000)}{' '}
                minutes
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Opening</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Closing</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{session.user_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {session.session_start && new Date(session.session_start).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {session.session_end ? new Date(session.session_end).toLocaleString() : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">KES {parseFloat(session.opening_balance || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">KES {session.closing_balance ? parseFloat(session.closing_balance).toFixed(2) : '-'}</td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-bold ${
                        session.variance && session.variance !== 0
                          ? session.variance > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {session.variance !== undefined && session.variance !== null
                        ? `KES ${parseFloat(session.variance).toFixed(2)}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Open Session Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md max-h-screen overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Open Cash Session</h2>
            <form onSubmit={handleOpenSession} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.opening_balance}
                  onChange={(e) => setFormData({ ...formData, opening_balance: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOpenModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg">
                  Open Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Session Modal */}
      {showCloseModal && activeSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md max-h-screen overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Close Cash Session</h2>
            <form onSubmit={handleCloseSession} className="space-y-5">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Opening Balance</p>
                <p className="font-bold text-2xl text-gray-800">KES {parseFloat(activeSession.opening_balance || 0).toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Closing Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.closing_balance}
                  onChange={(e) => setFormData({ ...formData, closing_balance: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                  placeholder="Explain any variance..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCloseModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg">
                  Close Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashSessions;
