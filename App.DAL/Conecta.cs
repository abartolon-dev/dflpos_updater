using App.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.DAL
{
    public class Conecta
    {
        public SqlConnection conexion(string _siteCode)
        {
            var _globalContext = new DFLSAIEntities();
            var connString = _globalContext.SITES.Find(_siteCode).site_connection_string;
            SqlConnection cnn = null;
            string[] Array = connString.Split(';');
            var Split = new List<string>();
            for (int i = 0; i < Array.Length - 1; i++)
            {
                var conn = Array[i].Split('=')[1];
                if (Array[i].Contains("password"))
                {
                    conn = Array[i].Replace("password=", "");
                }
                Split.Add(conn);
            }
            try
            {

                //Initialize the SqlConnectionStringBuilder
                //SqlConnectionStringBuilder sqlConnectionBuilder = new SqlConnectionStringBuilder();
                //sqlConnectionBuilder.DataSource = @"" + Split[1];
                //sqlConnectionBuilder.InitialCatalog = Split[2];
                ////sqlConnectionBuilder.IntegratedSecurity = true;
                ////sqlConnectionBuilder.MultipleActiveResultSets = true;
                //sqlConnectionBuilder.UserID = Split[3];
                //sqlConnectionBuilder.Password = Split[4];
                //string sqlConnectionString = sqlConnectionBuilder.ConnectionString;

                ////Initialize the EntityConnectionStringBuilder
                //EntityConnectionStringBuilder entityBuilder = new EntityConnectionStringBuilder();
                //entityBuilder.Provider = "System.Data.SqlClient";
                //entityBuilder.ProviderConnectionString = sqlConnectionString;

                ////Set the Metadata location.
                //entityBuilder.Metadata = @"res://*/FloridoERPTXModel.csdl|res://*/FloridoERPTXModel.ssdl|res://*/FloridoERPTXModel.msl";

                ////Create entity connection
                //EntityConnection connection = new EntityConnection(entityBuilder.ConnectionString);

               
                String pwd = Split[4];
                String based = Split[2];
                String user = Split[3];
                String server = Split[1];
                String cadena = "Data Source=" + server + ";database=" + based + ";user id =" + user +
                    ";password =" + pwd + ";Trusted_Connection=false";
                //String cadena = ("Data Source=.\\SQLEXPRESS;database=PATRICIO;user id =sa; password =sql;Trusted_Connection=false");

                cnn = new
                      SqlConnection(cadena);

            }
            catch (Exception ex)
            {
                //MessageBox.Show(ex.Message.ToString());
                // MessageBox.Show("Error en la comunicación al Servidor, pongase en contacto con el departamento de sistemas");
            }
            return cnn;

        }
    }
}
