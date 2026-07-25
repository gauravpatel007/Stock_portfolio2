import { useState, useRef, useEffect } from "react";
import { X, Camera, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function UserProfileModal({ isOpen, onClose }) {
  const { user, token, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "");
      setAge(user.age || "");
      setProfilePic(user.profilePic || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          age: age === "" ? null : Number(age),
          profilePic,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        updateUser(data.user);
        onClose();
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-[450px] p-8 relative overflow-hidden transition-colors" onClick={(e) => e.stopPropagation()}>
        
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white/20 p-1.5 rounded-full transition z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 flex flex-col items-center mt-12 mb-6">
          {/* Avatar Upload */}
          <div className="relative group">
            <div 
              className={`w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-lg flex items-center justify-center text-4xl font-bold text-slate-400 dark:text-slate-300 ${profilePic ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
              onClick={() => profilePic && setShowImagePreview(true)}
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-800 hover:bg-blue-700 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">Edit Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Age</label>
            <input 
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-transparent dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. 25"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg cursor-pointer transition disabled:opacity-50"
          >
            {loading ? "Saving..." : <><Save className="w-5 h-5" /> Save Profile</>}
          </button>
        </div>

      </div>
    </div>

    {/* Full-screen Image Preview Overlay */}
    {showImagePreview && profilePic && (
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center cursor-zoom-out"
        onClick={() => setShowImagePreview(false)}
      >
        <button 
          className="absolute top-6 right-6 text-white hover:bg-white/20 p-2 rounded-full transition z-10 cursor-pointer"
          onClick={() => setShowImagePreview(false)}
        >
          <X className="w-8 h-8" />
        </button>
        <img 
          src={profilePic} 
          alt="Profile Preview Full" 
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
    </>
  );
}

export default UserProfileModal;
