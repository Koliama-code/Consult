const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:3000/doctors");
    const doctors = await response.json();
    
    const doctor = doctors.find(
      (d: any) => d.email === email && d.password === password
    );

    if (doctor) {
      // Store both user object and doctorId
      localStorage.setItem("user", JSON.stringify(doctor));
      localStorage.setItem("doctorId", doctor.id);
      
      navigate("/doctor", { state: { user: doctor } });
      toast.success("Connexion réussie!");
    } else {
      // ... rest of the error handling code ...
    }
  } catch (error) {
    console.error("Error during login:", error);
    toast.error("Erreur lors de la connexion");
  }
};