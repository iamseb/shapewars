// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

#if !(UNITY_IPHONE || UNITY_ANDROID)

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Movie)]
	[Tooltip("Plays a Movie Texture. Use the Movie Texture in a Material, or in the GUI.")]
	public class PlayMovieTexture : FsmStateAction
	{
		public MovieTexture movieTexture;
		public FsmBool loop;
		
		public override void Reset()
		{
			movieTexture = null;
			loop = false;
		}

		public override void OnEnter()
		{
			movieTexture.loop = loop.Value;
			movieTexture.Play();
			Finish();
		}
	}
}

#endif