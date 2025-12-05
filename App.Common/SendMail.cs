using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Common
{
    public class SendMail
    {
        private string Title;
        public string title
        {
            get { return Title; }
            set { Title = value; }
        }
        private string Body;
        public string body
        {
            get { return Body; }
            set { Body = value; }
        }
        private string ButtonLink;
        public string buttonLink
        {
            get { return ButtonLink; }
            set { ButtonLink = value; }
        }
        private string ButonText;
        public string buttonText
        {
            get { return ButonText; }
            set { ButonText = value; }
        }
        private string Subject;
        public string subject
        {
            get { return Subject; }
            set { Subject = value; }
        }
        private string From;
        public string from
        {
            get { return From; }
            set { From = value; }
        }
        private string Email;
        public string email
        {
            get { return Email; }
            set { Email = value; }
        }
        /*purchase order*/
        private string Folio;

        public string folio
        {
            get { return Folio; }
            set { Folio = value; }
        }
        private string Store;

        public string store
        {
            get { return Store; }
            set { Store = value; }
        }
        private string Date;

        public string date
        {
            get { return Date; }
            set { Date = value; }
        }
        private string Currency;

        public string currecy
        {
            get { return Currency; }
            set { Currency = value; }
        }
        private string Supplier;

        public string supplier
        {
            get { return Supplier; }
            set { Supplier = value; }
        }

        private string Item;

        public string item
        {
            get { return Item; }
            set { Item = value; }
        }

        private string Label;

        public string label
        {
            get { return Label; }
            set { Label = value; }
        }

        private string Project;

        public string project
        {
            get { return Project; }
            set { Project = value; }
        }
    }
}
