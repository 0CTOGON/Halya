using Microsoft.Web.WebView2.WinForms;
using Microsoft.Web.WebView2.Core;
using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace HalyaApp
{
    public partial class Form1 : Form
    {
        private WebView2 webView;

        public Form1()
        {
            InitializeComponent();

            Text = "halya.";

            // Remove Windows title bar
            FormBorderStyle = FormBorderStyle.None;

            // Allow resizing
            MinimumSize = new Size(900, 600);

            Width = 1200;
            Height = 800;


            // Taskbar / window icon
            string iconPath = Path.Combine(
                Application.StartupPath,
                "web",
                "icons",
                "appIcon.ico"
            );

            if (File.Exists(iconPath))
            {
                Icon = new Icon(iconPath);
            }


            webView = new WebView2();

            webView.Dock = DockStyle.Fill;

            Controls.Add(webView);

            Load += Form1_Load;
        }


        private async void Form1_Load(object? sender, EventArgs e)
        {
            await webView.EnsureCoreWebView2Async();


            string webPath = Path.Combine(
                Application.StartupPath,
                "web"
            );


            webView.CoreWebView2
                .SetVirtualHostNameToFolderMapping(
                    "halya.local",
                    webPath,
                    CoreWebView2HostResourceAccessKind.Allow
                );


            webView.CoreWebView2
                .WebMessageReceived += WebMessageReceived;


            webView.Source =
                new Uri("https://halya.local/index.html");
        }



        private void WebMessageReceived(
            object? sender,
            CoreWebView2WebMessageReceivedEventArgs e)
        {
            string message =
                e.TryGetWebMessageAsString();


            switch(message)
            {

                case "close":

                    Close();

                    break;


                case "minimize":

                    WindowState =
                        FormWindowState.Minimized;

                    break;


                case "maximize":

                    if (WindowState ==
                        FormWindowState.Maximized)
                    {
                        WindowState =
                            FormWindowState.Normal;
                    }
                    else
                    {
                        WindowState =
                            FormWindowState.Maximized;
                    }

                    break;



                case "drag":

                    BeginInvoke(new Action(() =>
                    {
                        NativeMethods.ReleaseCapture();

                        NativeMethods.SendMessage(
                            Handle,
                            0xA1,
                            0x2,
                            0
                        );

                    }));

                    break;
            }
        }
    }
}