// Code: Admin panel for managing veterinarians and departments
//       This component is used to add, edit, and delete veterinarians and departments
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Save,
  X,
  Check,
  Trash,
  Users,
  Layers,
  ArrowLeft,
} from "lucide-react";

/*************************************************************/
const AddVeterinarians = ({ onBack, onDataUpdate, initialDepartments }) => {
  const [vets, setVets] = useState([]);
  const [departments, setDepartments] = useState(initialDepartments || []);
  const [isAddingVet, setIsAddingVet] = useState(false);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);

  const [newVet, setNewVet] = useState({
    name: "",
    nameAr: "", // Arabic name field
    department: "",
    experience: 0,
    rating: 4.5,
    reviewCount: 0,
    specializations: [""],
    specializationsAr: [""], // Arabic specializations
  });

  const [newDepartment, setNewDepartment] = useState({
    id: "",
    name: "",
    nameAr: "", // Arabic department name
    icon: "🐾",
  });

  const availableIcons = [
    "🐔",
    "🐄",
    "🐑",
    "🐕",
    "🐎",
    "🐖",
    "🐐",
    "🦙",
    "🐾",
    "🦃",
  ];

  /*************************************************************/
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "https://farm-fusion-srt9.onrender.com/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  /*************************************************************/
  useEffect(() => {
    const fetchVets = async () => {
      try {
        const response = await axios.get("https://farm-fusion-srt9.onrender.com/api/vets");
        setVets(response.data);
      } catch (error) {
        console.error("Error fetching vets:", error);
      }
    };

    fetchVets();
  }, []);

  /*************************************************************/
  const addSpecialization = () => {
    setNewVet({
      ...newVet,
      specializations: [...newVet.specializations, ""],
      specializationsAr: [...newVet.specializationsAr, ""],
    });
  };

  /*************************************************************/
  const handleSpecChange = (index, value, isArabic = false) => {
    const field = isArabic ? "specializationsAr" : "specializations";
    const updatedSpecs = [...newVet[field]];
    updatedSpecs[index] = value;
    setNewVet({ ...newVet, [field]: updatedSpecs });
  };

  /*************************************************************/
  const removeSpecialization = (index) => {
    const updatedSpecs = [...newVet.specializations];
    const updatedSpecsAr = [...newVet.specializationsAr];
    updatedSpecs.splice(index, 1);
    updatedSpecsAr.splice(index, 1);
    setNewVet({
      ...newVet,
      specializations: updatedSpecs,
      specializationsAr: updatedSpecsAr,
    });
  };

  /*************************************************************/
  const handleAddVet = async () => {
    if (
      !newVet.name ||
      !newVet.nameAr ||
      !newVet.department ||
      newVet.experience <= 0 ||
      newVet.specializations[0] === "" ||
      newVet.specializationsAr[0] === ""
    ) {
      alert("Please fill in all required fields in both languages");
      return;
    }

    try {
      const response = await axios.post(
        "https://farm-fusion-srt9.onrender.com/api/vets/add",
        newVet
      );
      const updatedVets = [...vets, response.data.vet];
      setVets(updatedVets);

      if (onDataUpdate) {
        onDataUpdate({ vets: updatedVets, departments });
      }

      setNewVet({
        name: "",
        nameAr: "",
        department: "",
        experience: 0,
        rating: 4.5,
        reviewCount: 0,
        specializations: [""],
        specializationsAr: [""],
      });

      setIsAddingVet(false);
    } catch (error) {
      console.error("Error adding vet:", error);
      alert("Error adding vet");
    }
  };

  /*************************************************************/
  const handleAddDepartment = async () => {
    if (!newDepartment.id || !newDepartment.name || !newDepartment.nameAr) {
      alert("Please fill in all required fields in both languages");
      return;
    }

    try {
      const response = await axios.post(
        "https://farm-fusion-srt9.onrender.com/api/departments/add",
        newDepartment
      );

      setDepartments([...departments, response.data.department]);

      setNewDepartment({
        id: "",
        name: "",
        nameAr: "",
        icon: "🐾",
      });

      setIsAddingDepartment(false);
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Error adding department");
    }
  };

  /*************************************************************/
  const handleDeleteVet = async (vetName) => {
    if (
      window.confirm(`Are you sure you want to delete veterinarian ${vetName}?`)
    ) {
      try {
        await axios.patch(`https://farm-fusion-srt9.onrender.com/api/vets/${vetName}`, {
          isDeleted: true,
        });

        const updatedVets = vets.filter((vet) => vet.name !== vetName);
        setVets(updatedVets);

        if (onDataUpdate) {
          onDataUpdate({ vets: updatedVets, departments });
        }
      } catch (error) {
        console.error("Error soft deleting vet:", error);
        alert("Error soft deleting vet");
      }
    }
  };

  /*************************************************************/
  const handleDeleteDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`https://farm-fusion-srt9.onrender.com/api/departments/${id}`);
        setDepartments(departments.filter((dept) => dept.id !== id));
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Error deleting department");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-green-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-green-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-10 h-10 text-white mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                <p className="text-green-100 mt-2 text-lg">
                  Manage veterinarians and departments
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white text-green-600 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Booking
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Departments Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Layers className="w-6 h-6 text-green-600 mr-2" />
                  Departments
                </h2>
                <button
                  onClick={() => setIsAddingDepartment(!isAddingDepartment)}
                  className="bg-green-100 text-green-600 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  {isAddingDepartment ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isAddingDepartment ? "Cancel" : "Add Department"}
                </button>
              </div>

              {/* Department List */}
              <div className="space-y-3 mt-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-4 rounded-lg border-2 border-gray-200 flex items-center justify-between hover:border-green-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dept.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-700">
                          {dept.name} / {dept.nameAr}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {dept.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {departments.length === 0 && !isAddingDepartment && (
                  <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p>No departments added yet</p>
                  </div>
                )}
              </div>

              {/* Add Department Form */}
              {isAddingDepartment && (
                <div className="mt-4 p-6 border-2 border-green-200 rounded-lg bg-green-50">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Add New Department
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department ID
                      </label>
                      <input
                        type="text"
                        value={newDepartment.id}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            id: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "-"),
                          })
                        }
                        placeholder="e.g. poultry, equine, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use lowercase letters without spaces (hyphen allowed)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department Name (English)
                      </label>
                      <input
                        type="text"
                        value={newDepartment.name}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g. Poultry Care"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department Name (Arabic)
                      </label>
                      <input
                        type="text"
                        value={newDepartment.nameAr}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            nameAr: e.target.value,
                          })
                        }
                        placeholder="e.g. رعاية الدواجن"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() =>
                              setNewDepartment({ ...newDepartment, icon })
                            }
                            className={`w-10 h-10 flex items-center justify-center text-xl rounded-md hover:bg-green-100 transition-colors ${
                              newDepartment.icon === icon
                                ? "bg-green-200 border-2 border-green-400"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleAddDepartment}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Department
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Veterinarians Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Users className="w-6 h-6 text-green-600 mr-2" />
                  Veterinarians
                </h2>
                <button
                  onClick={() => setIsAddingVet(!isAddingVet)}
                  className="bg-green-100 text-green-600 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  {isAddingVet ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isAddingVet ? "Cancel" : "Add Veterinarian"}
                </button>
              </div>

              {/* Vet List */}
              <div className="space-y-4 mt-4">
                {vets.map((vet) => (
                  <div
                    key={vet.name}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-200 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                          {vet.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">
                            Dr. {vet.name} / د. {vet.nameAr}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {departments.find((d) => d.id === vet.department)
                              ?.name || vet.department}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteVet(vet.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {vet.experience} Years Experience
                      </span>
                      {vet.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {spec} / {vet.specializationsAr[index]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {vets.length === 0 && !isAddingVet && (
                  <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p>No veterinarians added yet</p>
                  </div>
                )}
              </div>

              {/* Add Vet Form */}
              {isAddingVet && (
                <div className="mt-4 p-6 border-2 border-green-200 rounded-lg bg-green-50">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Add New Veterinarian
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name (English)
                      </label>
                      <input
                        type="text"
                        value={newVet.name}
                        onChange={(e) =>
                          setNewVet({ ...newVet, name: e.target.value })
                        }
                        placeholder="Veterinarian name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name (Arabic)
                      </label>
                      <input
                        type="text"
                        value={newVet.nameAr}
                        onChange={(e) =>
                          setNewVet({ ...newVet, nameAr: e.target.value })
                        }
                        placeholder="اسم الطبيب البيطري"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        value={newVet.department}
                        onChange={(e) =>
                          setNewVet({ ...newVet, department: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.icon} {dept.name} / {dept.nameAr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={newVet.experience}
                        onChange={(e) =>
                          setNewVet({
                            ...newVet,
                            experience: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                        max="50"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specializations
                      </label>
                      {newVet.specializations.map((spec, index) => (
                        <div key={index} className="space-y-2 mb-4">
                          <div className="flex">
                            <input
                              type="text"
                              value={spec}
                              onChange={(e) =>
                                handleSpecChange(index, e.target.value)
                              }
                              placeholder={`Specialization ${
                                index + 1
                              } (English)`}
                              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex">
                            <input
                              type="text"
                              value={newVet.specializationsAr[index]}
                              onChange={(e) =>
                                handleSpecChange(index, e.target.value, true)
                              }
                              placeholder={`التخصص ${index + 1} (عربي)`}
                              className="flex-grow px-4 py-2 border border-gray-300 rounded-md text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              dir="rtl"
                            />
                            <button
                              type="button"
                              onClick={() => removeSpecialization(index)}
                              disabled={newVet.specializations.length === 1}
                              className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSpecialization}
                        className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Another Specialization
                      </button>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleAddVet}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Veterinarian
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-green-50 p-4 text-center text-sm text-gray-600 border-t border-green-100">
          Farm Vet Services - Administrative Panel
        </div>
      </div>
    </div>
  );
};

export default AddVeterinarians;
// Code: Admin panel for managing veterinarians and departments
//       This component is used to add, edit, and delete veterinarians and departments
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Plus,
//   Save,
//   X,
//   Check,
//   Trash,
//   Users,
//   Layers,
//   ArrowLeft,
// } from "lucide-react";

// /*************************************************************/
// const AddVeterinarians = ({ onBack, onDataUpdate, initialDepartments }) => {
//   const [vets, setVets] = useState([]);
//   const [departments, setDepartments] = useState(initialDepartments || []);
//   const [isAddingVet, setIsAddingVet] = useState(false);
//   const [isAddingDepartment, setIsAddingDepartment] = useState(false);

//   const [newVet, setNewVet] = useState({
//     name: "",
//     department: "",
//     experience: 0,
//     rating: 4.5,
//     reviewCount: 0,
//     specializations: [""],
//   });

//   const [newDepartment, setNewDepartment] = useState({
//     id: "",
//     name: "",
//     icon: "🐾",
//   });

//   const availableIcons = [
//     "🐔",
//     "🐄",
//     "🐑",
//     "🐕",
//     "🐎",
//     "🐖",
//     "🐐",
//     "🦙",
//     "🐾",
//     "🦃",
//   ];

//   /*************************************************************/
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await axios.get(
//           "https://farm-fusion-srt9.onrender.com/api/departments"
//         );
//         setDepartments(response.data);
//       } catch (error) {
//         console.error("Error fetching departments:", error);
//       }
//     };

//     fetchDepartments();
//   }, []);

//   /*************************************************************/
//   useEffect(() => {
//     const fetchVets = async () => {
//       try {
//         const response = await axios.get("https://farm-fusion-srt9.onrender.com/api/vets");
//         setVets(response.data);
//       } catch (error) {
//         console.error("Error fetching vets:", error);
//       }
//     };

//     fetchVets();
//   }, []);

//   /*************************************************************/
//   const addSpecialization = () => {
//     setNewVet({
//       ...newVet,
//       specializations: [...newVet.specializations, ""],
//     });
//   };

//   /*************************************************************/
//   const handleSpecChange = (index, value) => {
//     const updatedSpecs = [...newVet.specializations];
//     updatedSpecs[index] = value;
//     setNewVet({ ...newVet, specializations: updatedSpecs });
//   };

//   /*************************************************************/
//   const removeSpecialization = (index) => {
//     const updatedSpecs = [...newVet.specializations];
//     updatedSpecs.splice(index, 1);
//     setNewVet({ ...newVet, specializations: updatedSpecs });
//   };

//   /*************************************************************/
//   const handleAddVet = async () => {
//     if (
//       !newVet.name ||
//       !newVet.department ||
//       newVet.experience <= 0 ||
//       newVet.specializations[0] === ""
//     ) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://farm-fusion-srt9.onrender.com/api/vets/add",
//         newVet
//       );
//       const updatedVets = [...vets, response.data.vet];
//       setVets(updatedVets);

//       if (onDataUpdate) {
//         onDataUpdate({ vets: updatedVets, departments });
//       }

//       setNewVet({
//         name: "",
//         department: "",
//         experience: 0,
//         rating: 4.5,
//         reviewCount: 0,
//         specializations: [""],
//       });

//       setIsAddingVet(false);
//     } catch (error) {
//       console.error("Error adding vet:", error);
//       alert("Error adding vet");
//     }
//   };

//   /*************************************************************/
//   const handleAddDepartment = async () => {
//     if (!newDepartment.id || !newDepartment.name) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://farm-fusion-srt9.onrender.com/api/departments/add",
//         newDepartment
//       );

//       setDepartments([...departments, response.data.department]);

//       setNewDepartment({
//         id: "",
//         name: "",
//         icon: "🐾",
//       });

//       setIsAddingDepartment(false);
//     } catch (error) {
//       console.error("Error adding department:", error);
//       alert("Error adding department");
//     }
//   };

//   /*************************************************************/
//   const handleDeleteVet = async (vetName) => {
//     if (
//       window.confirm(`Are you sure you want to delete veterinarian ${vetName}?`)
//     ) {
//       try {
//         await axios.patch(`https://farm-fusion-srt9.onrender.com/api/vets/${vetName}`, {
//           isDeleted: true,
//         });

//         const updatedVets = vets.filter((vet) => vet.name !== vetName);
//         setVets(updatedVets);

//         if (onDataUpdate) {
//           onDataUpdate({ vets: updatedVets, departments });
//         }
//       } catch (error) {
//         console.error("Error soft deleting vet:", error);
//         alert("Error soft deleting vet");
//       }
//     }
//   };

//   /*************************************************************/
//   const handleDeleteDepartment = async (id) => {
//     if (window.confirm("Are you sure you want to delete this department?")) {
//       try {
//         await axios.delete(`https://farm-fusion-srt9.onrender.com/api/departments/${id}`);
//         setDepartments(departments.filter((dept) => dept.id !== id));
//       } catch (error) {
//         console.error("Error deleting department:", error);
//         alert("Error deleting department");
//       }
//     }
//   };
//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-green-50 min-h-screen">
//       <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-green-100">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 relative">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
//           <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Users className="w-10 h-10 text-white mr-4" />
//               <div>
//                 <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
//                 <p className="text-green-100 mt-2 text-lg">
//                   Manage veterinarians and departments
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onBack}
//               className="flex items-center gap-2 bg-white text-green-600 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Booking
//             </button>
//           </div>
//         </div>

//         <div className="p-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Departments Section */}
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                   <Layers className="w-6 h-6 text-green-600 mr-2" />
//                   Departments
//                 </h2>
//                 <button
//                   onClick={() => setIsAddingDepartment(!isAddingDepartment)}
//                   className="bg-green-100 text-green-600 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
//                 >
//                   {isAddingDepartment ? (
//                     <X className="w-4 h-4" />
//                   ) : (
//                     <Plus className="w-4 h-4" />
//                   )}
//                   {isAddingDepartment ? "Cancel" : "Add Department"}
//                 </button>
//               </div>

//               {/* Department List */}
//               <div className="space-y-3 mt-4">
//                 {departments.map((dept) => (
//                   <div
//                     key={dept.id}
//                     className="p-4 rounded-lg border-2 border-gray-200 flex items-center justify-between hover:border-green-200 transition-all"
//                   >
//                     <div className="flex items-center gap-3">
//                       <span className="text-2xl">{dept.icon}</span>
//                       <div>
//                         <h3 className="font-medium text-gray-700">
//                           {dept.name}
//                         </h3>
//                         <p className="text-sm text-gray-500">ID: {dept.id}</p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleDeleteDepartment(dept.id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}

//                 {departments.length === 0 && !isAddingDepartment && (
//                   <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                     <p>No departments added yet</p>
//                   </div>
//                 )}
//               </div>

//               {/* Add Department Form */}
//               {isAddingDepartment && (
//                 <div className="mt-4 p-6 border-2 border-green-200 rounded-lg bg-green-50">
//                   <h3 className="font-semibold text-gray-800 mb-4">
//                     Add New Department
//                   </h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Department ID
//                       </label>
//                       <input
//                         type="text"
//                         value={newDepartment.id}
//                         onChange={(e) =>
//                           setNewDepartment({
//                             ...newDepartment,
//                             id: e.target.value
//                               .toLowerCase()
//                               .replace(/\s+/g, "-"),
//                           })
//                         }
//                         placeholder="e.g. poultry, equine, etc."
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         Use lowercase letters without spaces (hyphen allowed)
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Department Name
//                       </label>
//                       <input
//                         type="text"
//                         value={newDepartment.name}
//                         onChange={(e) =>
//                           setNewDepartment({
//                             ...newDepartment,
//                             name: e.target.value,
//                           })
//                         }
//                         placeholder="e.g. Poultry Care"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Icon
//                       </label>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {availableIcons.map((icon) => (
//                           <button
//                             key={icon}
//                             type="button"
//                             onClick={() =>
//                               setNewDepartment({ ...newDepartment, icon })
//                             }
//                             className={`w-10 h-10 flex items-center justify-center text-xl rounded-md hover:bg-green-100 transition-colors ${
//                               newDepartment.icon === icon
//                                 ? "bg-green-200 border-2 border-green-400"
//                                 : "bg-white border border-gray-200"
//                             }`}
//                           >
//                             {icon}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="pt-4">
//                       <button
//                         onClick={handleAddDepartment}
//                         className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//                       >
//                         <Save className="w-4 h-4" />
//                         Save Department
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Veterinarians Section */}
//             <div className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//                   <Users className="w-6 h-6 text-green-600 mr-2" />
//                   Veterinarians
//                 </h2>
//                 <button
//                   onClick={() => setIsAddingVet(!isAddingVet)}
//                   className="bg-green-100 text-green-600 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
//                 >
//                   {isAddingVet ? (
//                     <X className="w-4 h-4" />
//                   ) : (
//                     <Plus className="w-4 h-4" />
//                   )}
//                   {isAddingVet ? "Cancel" : "Add Veterinarian"}
//                 </button>
//               </div>

//               {/* Vet List */}
//               <div className="space-y-4 mt-4">
//                 {vets.map((vet) => (
//                   <div
//                     key={vet.name}
//                     className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-200 transition-all"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
//                           {vet.name.charAt(0)}
//                         </div>
//                         <div>
//                           <h3 className="font-medium text-gray-700">
//                             Dr. {vet.name}
//                           </h3>
//                           <p className="text-sm text-gray-500">
//                             {departments.find((d) => d.id === vet.department)
//                               ?.name || vet.department}
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => handleDeleteVet(vet.name)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <Trash className="w-4 h-4" />
//                       </button>
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
//                         {vet.experience} Years Experience
//                       </span>
//                       {vet.specializations.map((spec, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
//                         >
//                           {spec}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 ))}

//                 {vets.length === 0 && !isAddingVet && (
//                   <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                     <p>No veterinarians added yet</p>
//                   </div>
//                 )}
//               </div>

//               {/* Add Vet Form */}
//               {isAddingVet && (
//                 <div className="mt-4 p-6 border-2 border-green-200 rounded-lg bg-green-50">
//                   <h3 className="font-semibold text-gray-800 mb-4">
//                     Add New Veterinarian
//                   </h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Name
//                       </label>
//                       <input
//                         type="text"
//                         value={newVet.name}
//                         onChange={(e) =>
//                           setNewVet({ ...newVet, name: e.target.value })
//                         }
//                         placeholder="Veterinarian name"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Department
//                       </label>
//                       <select
//                         value={newVet.department}
//                         onChange={(e) =>
//                           setNewVet({ ...newVet, department: e.target.value })
//                         }
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       >
//                         <option value="">Select Department</option>
//                         {departments.map((dept) => (
//                           <option key={dept.id} value={dept.id}>
//                             {dept.icon} {dept.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Years of Experience
//                       </label>
//                       <input
//                         type="number"
//                         value={newVet.experience}
//                         onChange={(e) =>
//                           setNewVet({
//                             ...newVet,
//                             experience: parseInt(e.target.value) || 0,
//                           })
//                         }
//                         min="0"
//                         max="50"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Specializations
//                       </label>
//                       {newVet.specializations.map((spec, index) => (
//                         <div key={index} className="flex mb-2">
//                           <input
//                             type="text"
//                             value={spec}
//                             onChange={(e) =>
//                               handleSpecChange(index, e.target.value)
//                             }
//                             placeholder={`Specialization ${index + 1}`}
//                             className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeSpecialization(index)}
//                             disabled={newVet.specializations.length === 1}
//                             className="px-3 py-2 bg-red-100 text-red-600 rounded-r-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={addSpecialization}
//                         className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
//                       >
//                         <Plus className="w-3 h-3" />
//                         Add Another Specialization
//                       </button>
//                     </div>

//                     <div className="pt-4">
//                       <button
//                         onClick={handleAddVet}
//                         className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//                       >
//                         <Save className="w-4 h-4" />
//                         Save Veterinarian
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="bg-green-50 p-4 text-center text-sm text-gray-600 border-t border-green-100">
//           Farm Vet Services - Administrative Panel
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddVeterinarians;
