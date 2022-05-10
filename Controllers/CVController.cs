using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TekshaAssesmentRepo.Helper;
using TekshaAssesmentRepo.Interfaces;
using TekshaAssesmentRepo.Models;
using TekshaAssesmentRepo.Utility;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TakshaTechAssesment.Controllers
{
    [Route("api/[controller]")]
    public class CVController : Controller
    {
        #region Declaration
        ICV _icv = null;
        //server directory foldername to store cv details
        private IWebHostEnvironment _hostingEnvironment;
        #endregion

        #region Default Constructor
        public CVController(ICV icv, IWebHostEnvironment environment)
        {
            _icv = icv;
            _hostingEnvironment = environment;
        }
        #endregion

        #region API Methods
        // GET: api/<controller>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        /// <summary>
        /// api for save Candidates CV details to server folder
        /// </summary>
        /// <param name="cvFile"></param>
        /// <param name="coverLetter"></param>
        /// <param name="values"></param>
        // POST api/<controller>
        [HttpPost]
        public JsonResult Post([FromForm] CVModel model)
        {
            JsonResult response = new JsonResult(string.Empty);
            ResponseModel responseModel = new ResponseModel();
            IFormFile cv = null,cover_letter = null;
            var fileList = Request.Form.Files;
            //get files from fromform
            //ValueEnum is enum class to compare value
            foreach(var file in fileList)
            {
                if (file.Name == Convert.ToString(ValueEnum.cv))
                    cv = file;
                else if (file.Name == Convert.ToString(ValueEnum.cover_letter))
                    cover_letter = file;
            }
            //Save files to folder
            if (cv != null)
                storeFile(cv, model,true);
            if (cover_letter != null)
                storeFile(cover_letter, model);
            //validate model
            string validationMessage = ValidatorHelper.Validate(model);
            //Save Model to db
            if (validationMessage == string.Empty)
            {
                var IsSaved = _icv.saveCV(model);
                if (IsSaved)
                {
                    response.StatusCode = Convert.ToInt16(ResCode.Success);
                    responseModel.Message = Convert.ToString(ValueEnum.Success);
                }
                else
                {
                    response.StatusCode = Convert.ToInt16(ResCode.Invalid);
                    responseModel.Message = Convert.ToString(ValueEnum.Failed);
                }
                responseModel.StatusCode = Convert.ToInt16(response.StatusCode);
                responseModel.Model = model;
                response.Value = responseModel;
            }
            else
            {
                //specify any input validation error here
                responseModel.StatusCode = Convert.ToInt16(ResCode.Invalid);
                responseModel.Message = validationMessage;
            }
            responseModel.Model = model;
            response.Value = responseModel;
            return response;
        }
        
        #endregion

        #region Public Method
        /// <summary>
        /// function to save files into server folder
        /// </summary>
        /// <param name="file"></param>
        /// <param name="cvmodel"></param>
        /// <param name="IsCv"></param>
        public async void storeFile(IFormFile file, CVModel cvmodel,bool IsCv = false)
        {
            //create directory according phone number
            //if already exist than it will be ignored and return object
            System.IO.Directory.CreateDirectory(_hostingEnvironment.WebRootPath+"\\"+ Convert.ToString(ValueEnum.CVs)+"\\"+cvmodel.email);
           
            //access folder path to place files into created/existed folder
            string folderPath = Path.Combine(_hostingEnvironment.WebRootPath+"\\"+ Convert.ToString(ValueEnum.CVs), cvmodel.email);
            string filePath = Path.Combine(folderPath, IsCv ? Convert.ToString(ValueEnum._cv) + file.FileName : Convert.ToString(ValueEnum._let) + file.FileName);
            if (IsCv)
                cvmodel.cv = filePath;
            else
                cvmodel.cover_letter = filePath;
            //copying file to folder location
            using (Stream fileStream = new FileStream(filePath, FileMode.Create))
            {
                try
                {
                    await file.CopyToAsync(fileStream);
                }
                catch (ObjectDisposedException)
                {}
            }
        }
        #endregion
    }
}
