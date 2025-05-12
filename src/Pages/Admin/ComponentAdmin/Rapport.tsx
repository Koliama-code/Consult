import React, { useState, useEffect } from "react";
import { FileText, Download, Calendar, Users } from "lucide-react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import axios from "axios";

// Define PDF styles
// Add Font registration
import { Font } from "@react-pdf/renderer";

// Register font to avoid font-related errors
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#FFFFFF",
    fontFamily: "Roboto",
  },
  headerSection: {
    backgroundColor: "#2563EB",
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  dateSubtitle: {
    fontSize: 12,
    color: "#E2E8F0",
    textAlign: "center",
    marginTop: 5,
  },
  contentSection: {
    padding: 20,
  },
  periodBox: {
    backgroundColor: "#F1F5F9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  dateLabel: {
    fontSize: 11,
    color: "#64748B",
    width: "30%",
  },
  dateValue: {
    fontSize: 11,
    color: "#334155",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBox: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 20,
    color: "#2563EB",
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  footer: {
    position: "absolute",
    bottom: 250,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#94A3B8",
  },
});

const PDFReport = ({ stats, reportType, dateRange }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>ConsultMe</Text>
        <Text style={styles.dateSubtitle}>
          Rapport du {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.contentSection}>
        <View style={styles.periodBox}>
          <Text style={styles.sectionTitle}>Période du Rapport</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Début:</Text>
            <Text style={styles.dateValue}>
              {dateRange.start || "Non spécifiée"}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Fin:</Text>
            <Text style={styles.dateValue}>
              {dateRange.end || "Non spécifiée"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Statistiques Générales</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalDoctors}</Text>
            <Text style={styles.statLabel}>Médecins</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalPatients}</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalDiagnostics}</Text>
            <Text style={styles.statLabel}>Diagnostics</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalOrdonnances}</Text>
            <Text style={styles.statLabel}>Ordonnances</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        Document généré automatiquement par ConsultMe • Confidentiel
      </Text>
    </Page>
  </Document>
);

const Rapport = () => {
  const [reportType, setReportType] = useState("general");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalDiagnostics: 0,
    totalOrdonnances: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        doctorsResponse,
        patientsResponse,
        ordonnancesResponse,
        diagnosticsResponse,
      ] = await Promise.all([
        axios.get("http://localhost:3000/doctors"),
        axios.get("http://localhost:3000/patients"),
        axios.get("http://localhost:3000/ordonnances"),
        axios.get("http://localhost:3000/diagnostics"),
      ]);

      setStats({
        totalDoctors: doctorsResponse.data.length,
        totalPatients: patientsResponse.data.length,
        totalDiagnostics: diagnosticsResponse.data.length,
        totalOrdonnances: ordonnancesResponse.data.length,
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des statistiques");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">
          Rapports et Statistiques
        </h2>
      </div>

      <div className="bg-[#2a303c] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">
          Générer un rapport
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Type de Rapport</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2"
            >
              <option value="general">Rapport Général</option>
              <option value="doctors">Rapport des Médecins</option>
              <option value="patients">Rapport des Patients</option>
              <option value="diagnostics">Rapport des Diagnostics</option>
              <option value="ordonnances">Rapport des Ordonnances</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Période</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="bg-gray-700 text-white rounded p-2"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="bg-gray-700 text-white rounded p-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <PDFDownloadLink
            document={
              <PDFReport
                stats={stats}
                reportType={reportType}
                dateRange={dateRange}
              />
            }
            fileName={`rapport-${reportType}-${new Date()
              .toLocaleDateString()
              .replace(/\//g, "-")}.pdf`}
          >
            {({ loading }) => (
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {loading ? (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Génération du PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Télécharger le rapport</span>
                  </>
                )}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default Rapport;
