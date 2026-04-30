using Microsoft.AspNetCore.Mvc;
using EcoDashBackend.Models;
using System.Collections.Generic;
using System.Linq;

namespace EcoDashBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        // Mock database
        private static readonly List<ProjectData> Projects = new List<ProjectData>
        {
            new ProjectData
            {
                Id = "p1",
                Name = "Baku City Mall Phase 2",
                Description = "Major commercial construction in downtown Baku.",
                Latitude = 40.3777,
                Longitude = 49.8920,
                EnergyKwh = 45000,
                Co2Tons = 35,
                WaterM3 = 120,
                WasteTons = 4,
                RecyclingRate = 45,
                EfficiencyMetric = "0.75 ton CO2 / sq meter",
                TransparencyScore = 92,
                ImageUrl = "https://images.unsplash.com/photo-1541888081691-11dcb1437146?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            new ProjectData
            {
                Id = "p2",
                Name = "Ganja Highway Expansion",
                Description = "Infrastructure project expanding the main route to Ganja.",
                Latitude = 40.6828,
                Longitude = 46.3606,
                EnergyKwh = 120000,
                Co2Tons = 110,
                WaterM3 = 500,
                WasteTons = 15,
                RecyclingRate = 20,
                EfficiencyMetric = "1.2 ton CO2 / km paved",
                TransparencyScore = 78,
                ImageUrl = "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            new ProjectData
            {
                Id = "p3",
                Name = "Sumqayit Tech Park",
                Description = "New industrial zone construction.",
                Latitude = 40.5897,
                Longitude = 49.6686,
                EnergyKwh = 85000,
                Co2Tons = 65,
                WaterM3 = 300,
                WasteTons = 8,
                RecyclingRate = 60,
                EfficiencyMetric = "0.5 ton CO2 / sq meter",
                TransparencyScore = 88,
                ImageUrl = "https://images.unsplash.com/photo-1504307651254-35680f35aa27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<ProjectData>> Get()
        {
            return Ok(Projects);
        }

        [HttpGet("{id}")]
        public ActionResult<ProjectData> GetById(string id)
        {
            var project = Projects.FirstOrDefault(p => p.Id == id);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }
    }
}
