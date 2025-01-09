import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { format, parse, isValid } from 'date-fns';
import { Bike, Lock } from 'lucide-react';
import { db } from './lib/firebase';
import { SearchBar } from './components/SearchBar';
import { DatePicker } from './components/DatePicker';
import { PassCard } from './components/PassCard';
import { Pass } from './types/pass';

function App() {
  const [passes, setPasses] = useState<Record<string, Pass>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if key exists in localStorage
    const savedKey = localStorage.getItem('rideIdKey');
    if (savedKey === 'v77') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const passesRef = ref(db, 'passes');
    
    onValue(passesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allPasses: Record<string, Pass> = {};
        
        Object.entries(data).forEach(([admissionNumber, passes]) => {
          Object.entries(passes as Record<string, Pass>).forEach(([passId, passData]) => {
            allPasses[`${admissionNumber}-${passId}`] = {
              ...passData,
              admissionNumber
            };
          });
        });
        
        setPasses(allPasses);
      }
      setLoading(false);
    });
  }, [isAuthenticated]);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === 'v77') {
      setIsAuthenticated(true);
      localStorage.setItem('rideIdKey', key);
      setError('');
    } else {
      setError('Invalid key');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rideIdKey');
    setKey('');
  };

  const filteredPasses = Object.entries(passes)
    .filter(([key, pass]) => {
      const matchesSearch = key.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedDate) {
        const passDate = parse(pass.time, 'M/d/yyyy, h:mm:ss a', new Date());
        const filterDate = parse(selectedDate, 'yyyy-MM-dd', new Date());
        
        return matchesSearch && isValid(passDate) && 
               format(passDate, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd');
      }
      
      return matchesSearch;
    })
    .sort(([, a], [, b]) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateB.getTime() - dateA.getTime();
    });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Bike className="text-blue-500" size={40} />
              <h1 className="text-4xl font-bold text-gray-900">Ride ID</h1>
            </div>
            <p className="text-gray-600">Please enter your access key to continue</p>
          </div>
          
          <form onSubmit={handleKeySubmit} className="bg-white p-8 rounded-xl shadow-md">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter access key"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Bike className="text-blue-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Ride ID</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading passes...</p>
          </div>
        ) : filteredPasses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No passes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPasses.map(([key, pass]) => (
              <PassCard key={key} pass={pass} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;