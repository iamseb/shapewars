// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

#if !(UNITY_IPHONE || UNITY_ANDROID)

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Movie)]
	[Tooltip("Pauses a Movie Texture.")]
	public class PauseMovieTexture : FsmStateAction
	{
		public MovieTexture movieTexture;

		public override void Reset()
		{
			movieTexture = null;
		}

		public override void OnEnter()
		{
			movieTexture.Pause();
			Finish();
		}
	}
}

#endif
