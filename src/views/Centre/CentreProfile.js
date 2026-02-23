// ═══════════════════════════════════════════════
// 📁 src/views/centre/CentreProfile.js
// ═══════════════════════════════════════════════

import React, { useState } from "react";

export default function CentreProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: "TechCentre Academy",
    email: "contact@techcentre.com",
    phone: "+216 71 234 567",
    address: "123 Avenue Habib Bourguiba, Tunis",
    website: "https://www.techcentre.com",
    description: "Leading training center specializing in web development, data science, and cloud computing.",
    foundedYear: "2018",
  });

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    localStorage.setItem("centreProfile", JSON.stringify(profile));
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="pb-8">

      {saved && (
        <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-3 rounded mb-6">
          <i className="fas fa-check-circle mr-2"></i>Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-gradient-to-r from-lightBlue-500 to-lightBlue-700 rounded-t-lg h-32 relative">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <i className="fas fa-building text-lightBlue-500 text-3xl"></i>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-6 px-6 text-center">
            <h3 className="text-xl font-bold text-blueGray-800">{profile.name}</h3>
            <p className="text-blueGray-400 text-sm">{profile.email}</p>
            <hr className="my-4" />
            <div className="text-left space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <i className="fas fa-phone text-blueGray-400 w-5"></i><span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="fas fa-map-marker-alt text-blueGray-400 w-5"></i><span>{profile.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="fas fa-globe text-blueGray-400 w-5"></i>
                <a href={profile.website} className="text-lightBlue-500">{profile.website}</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="fas fa-calendar text-blueGray-400 w-5"></i><span>Founded: {profile.foundedYear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-blueGray-700"><i className="fas fa-cog text-blueGray-400 mr-2"></i>Centre Settings</h3>
            <button onClick={() => setIsEditing(!isEditing)}
              className={`text-sm font-bold px-4 py-2 rounded ${isEditing ? "bg-blueGray-200 text-blueGray-700" : "bg-lightBlue-500 text-white"}`}>
              {isEditing ? <><i className="fas fa-times mr-1"></i>Cancel</> : <><i className="fas fa-edit mr-1"></i>Edit</>}
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-blueGray-600 text-sm font-bold mb-2">Centre Name</label>
                <input type="text" value={profile.name} onChange={(e) => handleChange("name", e.target.value)} disabled={!isEditing}
                  className={`border rounded-lg px-4 py-3 w-full text-sm ${isEditing ? "focus:outline-none focus:ring-2 focus:ring-lightBlue-500" : "bg-blueGray-50"}`} />
              </div>
              <div>
                <label className="block text-blueGray-600 text-sm font-bold mb-2">Email</label>
                <input type="email" value={profile.email} onChange={(e) => handleChange("email", e.target.value)} disabled={!isEditing}
                  className={`border rounded-lg px-4 py-3 w-full text-sm ${isEditing ? "focus:outline-none focus:ring-2 focus:ring-lightBlue-500" : "bg-blueGray-50"}`} />
              </div>
              <div>
                <label className="block text-blueGray-600 text-sm font-bold mb-2">Phone</label>
                <input type="tel" value={profile.phone} onChange={(e) => handleChange("phone", e.target.value)} disabled={!isEditing}
                  className={`border rounded-lg px-4 py-3 w-full text-sm ${isEditing ? "focus:outline-none focus:ring-2 focus:ring-lightBlue-500" : "bg-blueGray-50"}`} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-blueGray-600 text-sm font-bold mb-2">Address</label>
                <input type="text" value={profile.address} onChange={(e) => handleChange("address", e.target.value)} disabled={!isEditing}
                  className={`border rounded-lg px-4 py-3 w-full text-sm ${isEditing ? "focus:outline-none focus:ring-2 focus:ring-lightBlue-500" : "bg-blueGray-50"}`} />
              </div>
              <div>
                <label className="block text-blueGray-600 text-sm font-bold mb-2">Website</label>
                <input type="url" value={profile.website} onChange={(e) => handleChange("website", e.target.value)} disabled={!isEditing}
                  className={`border rounded-lg px-4 py-3 w-full text-sm ${isEditing ? "focus:outline-none focus:ring-2 focus:ring-lightBlue-500" : "bg-blueGray-50"}`} />
              </div>
              <div>
                <label className="block text-blueGray-600 text-sm font-bold mb-2">Founded Year</label>
                <input type="text" value={profile.foundedYear} onChange={(e) => handleChange("foundedYear", e.target.value)} disabled={!isEditing}
                  className={`border rounded-lg px-4 py-3 w-full text-sm ${isEditing ? "focus:outline-none focus:ring-2 focus:ring-lightBlue-500" : "bg-blueGray-50"}`} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-blueGray-600 text-sm font-bold mb-2">Description</label>
                <textarea value={profile.description} onChange={(e) => handleChange("description", e.target.value)} disabled={!isEditing} rows="4"
                  className={`border rounded-lg px-4 py-3 w-full text-sm ${isEditing ? "focus:outline-none focus:ring-2 focus:ring-lightBlue-500" : "bg-blueGray-50"}`} />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end mt-6">
                <button onClick={handleSave} className="bg-emerald-500 text-white font-bold text-sm px-8 py-3 rounded shadow hover:shadow-lg">
                  <i className="fas fa-save mr-2"></i>Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}