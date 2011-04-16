// LightLibrary.js
//
// Created by: Greg Bassett
// Company: A-Lab Software Limited (http://www.alabsoft.com)
//
// Version: 1.0
//
//
// Copyright © A-Lab Software Limited 2010
//

import System.IO; 

class LightLibrary extends EditorWindow {
 
	@MenuItem ("Window/Light Library")
    static function ShowWindow () {
        EditorWindow.GetWindow (LightLibrary);
    }

	private var mainScrollPosition : Vector2;
	private var lightsScrollPosition : Vector2;

	private var btnImage1 : Texture = Resources.Load("btnImage_textured");
	private var btnImage2 : Texture = Resources.Load("btnImage_sunset");
	private var btnImage3 : Texture = Resources.Load("btnImage_starynight");
	private var btnImage4 : Texture = Resources.Load("btnImage_white");
	private var btnImage5 : Texture = Resources.Load("btnImage_sunrise");
	private var btnImage6 : Texture = Resources.Load("btnImage_overcast");
	private var btnImage7 : Texture = Resources.Load("btnImage_coloured");
	private var btnImage8 : Texture = Resources.Load("btnImage_midafternoon");
	private var btnImage9 : Texture = Resources.Load("btnImage_local");
	private var btnImage10 : Texture = Resources.Load("btnImage_multicolour");
	private var btnImage11 : Texture = Resources.Load("btnImage_noon");
	private var btnImage12 : Texture = Resources.Load("btnImage_spot");
	private var btnImage13 : Texture = Resources.Load("btnImage_multispot");
	private var btnImage14 : Texture = Resources.Load("btnImage_fullmoon");
	private var btnImage15 : Texture = Resources.Load("btnImage_infinite");
	private var btnImage16 : Texture = Resources.Load("btnImage_negative");
	private var btnImage17 : Texture = Resources.Load("btnImage_cloudy");
	private var btnImage18 : Texture = Resources.Load("btnImage_nolights");
	
	function OnGUI() {
		
		GUILayout.Label ("Lights", EditorStyles.toolbarButton);

		lightsScrollPosition = EditorGUILayout.BeginScrollView (lightsScrollPosition); 
        
		GUILayout.BeginHorizontal ();
			if (GUILayout.Button (btnImage1, GUILayout.Width(60),GUILayout.Height(60))) {

				// Textured Lights	
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(87.47, -63.68, -27.36), 0.2, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(146.30, -147.38, 26.19), 0.2, 10);
					CreateLight(LightType.Point, "PointLight01", Color(1, 0.92, 0.87) , Vector3(10.347, 5.992, 2.443), Vector3(0, 0, 0), 0.5, 20);
					CreateLight(LightType.Point, "PointLight02", Color(1, 1, 1) , Vector3(-11.986, 12.272, 13.809), Vector3(0, 0, 0), 0.5, 20);
					RenderSettings.ambientLight = Color(0.2, 0.2, 0.2);
				}						

			}

			if (GUILayout.Button (btnImage2, GUILayout.Width(60),GUILayout.Height(60))) {
				// Sunset Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(270, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 300, -0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight05", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 60, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight06", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 120, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight07", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 180, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight08", Color(0.58, 0.18, 0) , Vector3(0, 0, 0), Vector3(0, 60, 0), 0.5, 10);	
					RenderSettings.ambientLight = Color(0.35, 0.2, 0.19);
				}
			}
			
			if (GUILayout.Button (btnImage3, GUILayout.Width(60),GUILayout.Height(60))) {
				// Starry Night Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(-10, 300, -0), 0.01, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(-10, 0, 0), 0.01, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(-10, 60, 0), 0.01, 10);
					CreateLight(LightType.Directional, "DirectionalLight05", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(-10, 120, 0), 0.01, 10);
					CreateLight(LightType.Directional, "DirectionalLight06", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(-10, 180, 0), 0.01, 10);
					RenderSettings.ambientLight = Color(0.07, 0.07, 0.07);
				}
			}
		GUILayout.EndHorizontal ();
		
		GUILayout.BeginHorizontal (GUILayout.MaxWidth(194));
			GUILayout.Label ("Textured", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Sunset", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Starry Night", EditorStyles.toolbarButton, GUILayout.Width(65));
		GUILayout.EndHorizontal ();

		GUILayout.BeginHorizontal ();
			if (GUILayout.Button (btnImage4, GUILayout.Width(60),GUILayout.Height(60))) {
				// White Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(70, 0, 0), 0.2, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(-20, 70, -0), 0.2, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(-20, 140, 0), 0.2, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(-20, 210, 0), 0.2, 10);
					RenderSettings.ambientLight = Color(0.57, 0.57, 0.57);
				}						
			}

			if (GUILayout.Button (btnImage5, GUILayout.Width(60),GUILayout.Height(60))) {
				// Sunrise Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(270, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 300, -0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight05", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 60, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight06", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 120, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight07", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 180, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight08", Color(0.35, 0.2, 0.1) , Vector3(0, 0, 0), Vector3(0, -120, 0), 0.5, 10);	
					RenderSettings.ambientLight = Color(0.72, 0.65, 0.48);
				}
			}
			
			if (GUILayout.Button (btnImage6, GUILayout.Width(60),GUILayout.Height(60))) {
				// Overcast Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.12, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(270, 0, 0), 0.12, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 300, -0), 0.12, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 0, 0), 0.12, 10);
					CreateLight(LightType.Directional, "DirectionalLight05", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 60, 0), 0.12, 10);
					CreateLight(LightType.Directional, "DirectionalLight06", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 120, 0), 0.12, 10);
					CreateLight(LightType.Directional, "DirectionalLight07", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 180, 0), 0.12, 10);
					RenderSettings.ambientLight = Color(0.31, 0.31, 0.37);
				}
			}
		GUILayout.EndHorizontal ();

		GUILayout.BeginHorizontal (GUILayout.MaxWidth(194));
			GUILayout.Label ("White", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Sunrise", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Overcast", EditorStyles.toolbarButton, GUILayout.Width(65));
		GUILayout.EndHorizontal ();

		GUILayout.BeginHorizontal ();
			if (GUILayout.Button (btnImage7, GUILayout.Width(60),GUILayout.Height(60))) {
				// Coloured Lights	
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Point, "PointLight01", Color(0.91, 0.63, 0.05) , Vector3(-4.827, 4.089, 1.121), Vector3(0, 0, 0), 2, 10);
					CreateLight(LightType.Point, "PointLight02", Color(0.05, 0.67, 0.92) , Vector3(3.631, 3.046, 5.116), Vector3(0, 0, 0), 2, 10);
					CreateLight(LightType.Point, "PointLight03", Color(1, 1, 1) , Vector3(-1.2, 2.93, -5.39), Vector3(0, 0, 0), 2, 10);
					RenderSettings.ambientLight = Color(0.2, 0.2, 0.2);
				}						
			}

			if (GUILayout.Button (btnImage8, GUILayout.Width(60),GUILayout.Height(60))) {
				// Afternoon Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(270, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 300, -0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight05", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 60, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight06", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 120, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight07", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 180, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight08", Color(0.35, 0.2, 0.1) , Vector3(0, 0, 0), Vector3(-60, 120, 0), 0.5, 10);	
					RenderSettings.ambientLight = Color(0.8, 0.67, 0.34);
				}				
			}
			
			if (GUILayout.Button (btnImage9, GUILayout.Width(60),GUILayout.Height(60))) {
				// Local Light	
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Point, "PointLight01", Color(1, 1, 1) , Vector3(0, 5, 0), Vector3(0, 0, 0), 1, 10);
					RenderSettings.ambientLight = Color(0.2, 0.2, 0.2);
				}												
			}
		GUILayout.EndHorizontal ();

		GUILayout.BeginHorizontal (GUILayout.MaxWidth(194));
			GUILayout.Label ("Coloured", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Afternoon", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Local", EditorStyles.toolbarButton, GUILayout.Width(65));
		GUILayout.EndHorizontal ();

		GUILayout.BeginHorizontal ();
			if (GUILayout.Button (btnImage10, GUILayout.Width(60),GUILayout.Height(60))) {
				// Multicolour Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Point, "PointLight01", Color(1, 0.34, 0.18) , Vector3(0.408, 5.018, 5.969), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight02", Color(1, 0, 0) , Vector3(-6.099, 5.944, 2.944), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight03", Color(1.00, 0.49, 0.97) , Vector3(-5.198, 3.763, -2.373), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight04", Color(0.12, 0.04, 1) , Vector3(-1.570, 4.014, -4.912), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight05", Color(0.72, 1, 0.83) , Vector3(-3.686, 4.673, 5.871), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight06", Color(1, 0.44, 0.23) , Vector3(4.305, 4.340, 2.622), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight07", Color(0.19, 1, 1) , Vector3(3.717, 5.520, -6.008), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight08", Color(0.14, 1, 0.15) , Vector3(6.356, 5.520, -1.991), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight09", Color(1, 0.57, 0.30) , Vector3(-3.007, 5.906, 1.581), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight10", Color(0.35, 1, 0.37) , Vector3(-6.123, 4.673, 5.417), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight11", Color(1, 0.48, 0.98) , Vector3(7.872, 3.763, -0.134), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight12", Color(1, 0.48, 0.98) , Vector3(2.208, 3.763, -10.439), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight13", Color(1, 0.61, 0.31) , Vector3(-2.980, 5.906, 7.683), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight14", Color(1, 0.61, 0.31) , Vector3(-8.132, 5.906, 3.909), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight15", Color(0.16, 0.28, 1) , Vector3(-1.929, 4.673, 2.613), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight16", Color(0.16, 0.28, 1) , Vector3(3.147, 1.469, -2.140), Vector3(0, 0, 0), 0.5, 10);
					CreateLight(LightType.Point, "PointLight17", Color(0.16, 0.28, 1) , Vector3(8.6, 1.546, 2.545), Vector3(0, 0, 0), 0.5, 10);
					RenderSettings.ambientLight = Color(0.2, 0.2, 0.2);
				}
			}

			if (GUILayout.Button (btnImage11, GUILayout.Width(60),GUILayout.Height(60))) {
				// Noon Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(270, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 300, -0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight05", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 60, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight06", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 120, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight07", Color(0.77, 0.94, 1) , Vector3(0, 0, 0), Vector3(0, 180, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight08", Color(0.35, 0.2, 0.1) , Vector3(0, 0, 0), Vector3(-60, 0, 0), 0.5, 10);	
					RenderSettings.ambientLight = Color(0.9, 0.77, 0.44);
				}							
			}
			
			if (GUILayout.Button (btnImage12, GUILayout.Width(60),GUILayout.Height(60))) {
				// Spot Light	
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Spot, "SpotLight01", Color(1, 1, 1) , Vector3(0, 5, 0), Vector3(90, 0, 0), 0.5, 10);
					RenderSettings.ambientLight = Color(0.2, 0.2, 0.2);
				}																		
			}
		GUILayout.EndHorizontal ();

		GUILayout.BeginHorizontal (GUILayout.MaxWidth(194));
			GUILayout.Label ("Multicolour", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Noon", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Spot", EditorStyles.toolbarButton, GUILayout.Width(65));
		GUILayout.EndHorizontal ();
		
		GUILayout.BeginHorizontal ();
			if (GUILayout.Button (btnImage13, GUILayout.Width(60),GUILayout.Height(60))) {
				// Multi Spot Lights	
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Spot, "SpotLight01", Color(1, 0.97, 0.5) , Vector3(-5, 5, 0), Vector3(45, 90, 0), 0.5, 10);
					CreateLight(LightType.Spot, "SpotLight02", Color(1, 0.97, 0.5) , Vector3(5, 5, 0), Vector3(45, 270, 0), 0.5, 10);
					CreateLight(LightType.Spot, "SpotLight03", Color(1, 0.97, 0.5) , Vector3(0, 5, 5), Vector3(45, 180, 180), 0.5, 10);
					CreateLight(LightType.Spot, "SpotLight04", Color(1, 0.97, 0.5) , Vector3(0, 5, -5), Vector3(45, 0, 0), 0.5, 10);
					RenderSettings.ambientLight = Color(0.2, 0.2, 0.2);
				}																		
			}

			if (GUILayout.Button (btnImage14, GUILayout.Width(60),GUILayout.Height(60))) {
				// Full Moon Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(0.98, 1, 0.91) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(270, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(0, 300, -0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(0, 0, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight05", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(0, 60, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight06", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(0, 120, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight07", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(0, 180, 0), 0.1, 10);
					RenderSettings.ambientLight = Color(0.23, 0.23, 0.2);
				}
			}
			
			if (GUILayout.Button (btnImage15, GUILayout.Width(60),GUILayout.Height(60))) {
				// Infinite Light
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.2, 10);
					RenderSettings.ambientLight = Color(0.2, 0.2, 0.2);
				}
						

			}
		GUILayout.EndHorizontal ();
		
		GUILayout.BeginHorizontal (GUILayout.MaxWidth(194));
			GUILayout.Label ("Multi Spot", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Full Moon", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("Infinite", EditorStyles.toolbarButton, GUILayout.Width(65));
		GUILayout.EndHorizontal ();

		GUILayout.BeginHorizontal ();
			if (GUILayout.Button (btnImage16, GUILayout.Width(60),GUILayout.Height(60))) {
				// Negative Lights	
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Spot, "SpotLight01", Color(1, 1, 0) , Vector3(-10, 10, 10), Vector3(45, 135, 0), 0.1, 40);
					CreateLight(LightType.Spot, "SpotLight02", Color(1, 1, 0) , Vector3(10, 10, -10), Vector3(45, 315, 0), 0.1, 40);
					CreateLight(LightType.Spot, "SpotLight03", Color(1, 1, 0) , Vector3(10, 10, 10), Vector3(45, 225, 0), 0.1, 40);
					CreateLight(LightType.Spot, "SpotLight04", Color(1, 1, 0) , Vector3(-10, 10, -10), Vector3(45, 45, 0), 0.1, 40);
					CreateLight(LightType.Point, "PointLight01", Color(1, 1, 1) , Vector3(10.347, 5.992, -2.443), Vector3(0, 0, 0), 1, 10);
					CreateLight(LightType.Point, "PointLight02", Color(1, 1, 1) , Vector3(-11.986, 12.272, -13.8), Vector3(0, 0, 0), 1, 10);
					CreateLight(LightType.Directional, "DirectionalLight01", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(0, 150, 0), 0.1, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(60, 30, 0), 0.1, 10);
					RenderSettings.ambientLight = Color(0.22, 0.17, 0.26);
				}
			}

			if (GUILayout.Button (btnImage17, GUILayout.Width(60),GUILayout.Height(60))) {
				// Cloudy Night Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					CreateLight(LightType.Directional, "DirectionalLight01", Color(1, 1, 1) , Vector3(0, 0, 0), Vector3(90, 0, 0), 0.05, 10);
					CreateLight(LightType.Directional, "DirectionalLight02", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(270, 0, 0), 0.05, 10);
					CreateLight(LightType.Directional, "DirectionalLight03", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 300, -0), 0.05, 10);
					CreateLight(LightType.Directional, "DirectionalLight04", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 0, 0), 0.05, 10);
					CreateLight(LightType.Directional, "DirectionalLight05", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 60, 0), 0.05, 10);
					CreateLight(LightType.Directional, "DirectionalLight06", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 120, 0), 0.05, 10);
					CreateLight(LightType.Directional, "DirectionalLight07", Color(0.87, 0.96, 0.99) , Vector3(0, 0, 0), Vector3(0, 180, 0), 0.05, 10);
					RenderSettings.ambientLight = Color(0.2, 0.23, 0.3);
				}
			}
			
			if (GUILayout.Button (btnImage18, GUILayout.Width(60),GUILayout.Height(60))) {
				// No Lights
				if(EditorUtility.DisplayDialogComplex("Warning!", "All current lights within the scene will be deleted, is that ok?", "Ok", "Cancel", "Abort") == 0) {
					DeleteAllLights();
					RenderSettings.ambientLight = Color(0.2, 0.2, 0.2);
				}						
			}
		GUILayout.EndHorizontal ();
		
		GUILayout.BeginHorizontal (GUILayout.MaxWidth(194));
			GUILayout.Label ("Negative", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("NightCloud", EditorStyles.toolbarButton, GUILayout.Width(65));
			GUILayout.Label ("No Lights", EditorStyles.toolbarButton, GUILayout.Width(65));
		GUILayout.EndHorizontal ();

		EditorGUILayout.EndScrollView();
		
	}

	function CreateLight(lightType : LightType, lightName : String, lightColor : Color, lightPosition : Vector3, lightRotation : Vector3, lightIntensity : float, lightRange : int) {
		
		// Make a game object
		var lightGameObject = new GameObject (lightName);

		// Add the light component
		lightGameObject.AddComponent (Light);

		// Set type
		lightGameObject.light.type = lightType;
		if(lightGameObject.light.type == LightType.Spot) {
			lightGameObject.light.spotAngle = 45;
		}
		
		// Set color, intensity and range
		lightGameObject.light.color = lightColor;
		lightGameObject.light.intensity = lightIntensity;
		lightGameObject.light.range = lightRange;
		
		// Set the position and rotation (or any transform property) after
		// adding the light component.
		lightGameObject.transform.position = lightPosition;
		lightGameObject.transform.eulerAngles = lightRotation;		
		
	}
	
	function DeleteAllLights() {
		lights = FindObjectsOfType (Light);
		for (var light : Light in lights) {
			//Debug.Log(light.name);
			if(light != null) {
				DestroyImmediate(GameObject.Find(light.name));
			}
		}		
	}

}