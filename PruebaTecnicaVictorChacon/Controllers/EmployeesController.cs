using API.Model;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private EmployeesDBContext dataBase;

        public EmployeesController(EmployeesDBContext _dataBase)
        {
            dataBase = _dataBase;
        }

        // GET: api/<EmployeesController>
        [HttpGet]
        public string Get()
        {
            return "WEB API READY!";
        }

        //This method returns and filters employee list
        [HttpPost]
        [Route("GetEmployeeList")]
        public IEnumerable<Employee> GetEmployeeList(filter EmployeeFilter)
        {
            var data = dataBase.Employee.Where( x => x.EmployeeId > 0 );

            if (!string.IsNullOrEmpty(EmployeeFilter.searchText))
            {
                data = data.Where( x => x.EmployeeLastName.ToLower().Contains(EmployeeFilter.searchText.ToLower()) || x.EmployeePhone.ToLower().Contains(EmployeeFilter.searchText.ToLower()));
            }

            var list = EmployeeFilter.Take == 6 ? 
                data.OrderBy(o => o.HireDate).Skip(0).Take(EmployeeFilter.Take).ToList() : 
                data.OrderBy(o => o.HireDate).ToList();

            return list;
        }


        //this method receive an employee object to add or update employee's information
        [HttpPost]
        [Route("AddOrUpdateEmployee")]
        public bool AddOrUpdateEmployee(Employee employee)
        {
            employee.HireDate = new DateTime(employee.HireDate.Year, employee.HireDate.Month, employee.HireDate.Day);
            if (employee.EmployeeId == 0) {
                dataBase.Employee.Add(employee);
                dataBase.SaveChanges();
            }
            else
            {
                var updateEmployee = dataBase.Employee.FirstOrDefault( x => x.EmployeeId == employee.EmployeeId );
                var entry = dataBase.Entry(updateEmployee);

                entry.CurrentValues.SetValues(employee);
                dataBase.SaveChanges();
            }

            return dataBase.Employee.Where( x => x.EmployeeId == employee.EmployeeId ).Any();
        }

        //this method deletes employees from database
        [HttpGet]
        [Route("DeleteEmployee/{id}")]
        public bool DeleteEmployee(int id)
        {
            var deleteEmployee = dataBase.Employee.FirstOrDefault(x => x.EmployeeId == id);

            dataBase.Employee.Remove(deleteEmployee);
            dataBase.SaveChanges();

            return !dataBase.Employee.Where(x => x.EmployeeId == id).Any();
        }
    }
}
