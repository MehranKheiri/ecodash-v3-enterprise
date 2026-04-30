namespace EcoDashBackend.Models
{
    public class ProjectData
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        
        // Operational Metrics (Daily Averages)
        public double EnergyKwh { get; set; }
        public double Co2Tons { get; set; }
        public double WaterM3 { get; set; }
        public double WasteTons { get; set; }
        public double RecyclingRate { get; set; }
        
        // Efficiency
        public string EfficiencyMetric { get; set; } = string.Empty;
        
        // Transparency
        public int TransparencyScore { get; set; }
        
        // UI
        public string ImageUrl { get; set; } = string.Empty;
    }
}
