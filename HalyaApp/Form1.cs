using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using System;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Windows.Forms;

namespace HalyaApp
{
    public partial class Form1 : Form
    {
        private WebView2 webView;

        private readonly HttpClient http = new HttpClient();


        public Form1()
        {
            InitializeComponent();


            Text = "halya.";
            Width = 1200;
            Height = 800;


            webView = new WebView2();

            webView.Dock = DockStyle.Fill;


            Controls.Add(webView);


            Load += Form1_Load;
        }



        private async void Form1_Load(object? sender, EventArgs e)
        {

            await webView.EnsureCoreWebView2Async();



            webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                "halya.local",
                Path.Combine(Application.StartupPath, "web"),
                CoreWebView2HostResourceAccessKind.Allow
            );



            webView.CoreWebView2.WebMessageReceived +=
                WebMessageReceived;



            webView.Source = new Uri(
                "https://halya.local/index.html"
            );

        }





        private async void WebMessageReceived(
            object? sender,
            CoreWebView2WebMessageReceivedEventArgs e)
        {

            string message =
                e.TryGetWebMessageAsString();



            if (message.StartsWith("rss:"))
            {

                string url =
                    message.Substring(4);



                try
                {

                    string xml =
                        await http.GetStringAsync(url);



                    string json =
                        JsonSerializer.Serialize(xml);



                    await webView.CoreWebView2.ExecuteScriptAsync(
                        $"window.receiveRSS({json});"
                    );

                }

                catch(Exception ex)
                {

                    MessageBox.Show(
                        "RSS error:\n\n" + ex.Message
                    );

                }

            }



            switch(message)
            {

                case "minimize":

                    WindowState =
                        FormWindowState.Minimized;

                    break;



                case "close":

                    Close();

                    break;

            }

        }

    }
}