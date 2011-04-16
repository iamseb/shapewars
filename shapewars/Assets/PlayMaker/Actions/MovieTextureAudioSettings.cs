// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

#if !(UNITY_IPHONE || UNITY_ANDROID)

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Movie)]
	[Tooltip("Sets the Game Object as the Audio Source associated with the Movie Texture. The Game Object must have an AudioSource Component.")]
	public class MovieTextureAudioSettings : FsmStateAction
	{
		public MovieTexture movieTexture;
		[CheckForComponent(typeof(AudioSource))]
		public FsmGameObject gameObject;
		// this gets overridden by AudioPlay...
		//public FsmFloat volume;

		public override void Reset()
		{
			movieTexture = null;
			gameObject = null;
			//volume = 1;
		}

		public override void OnEnter()
		{
			if (movieTexture != null && gameObject.Value != null) 
			{
				var audio = gameObject.Value.audio;
				if (audio != null)
				{
					audio.clip = movieTexture.audioClip;
					
					//if (!volume.IsNone)
					//	audio.volume = volume.Value;
				}
			}
				
			Finish();
		}
	}
}

#endif

