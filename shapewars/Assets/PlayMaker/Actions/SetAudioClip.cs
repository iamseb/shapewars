// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Audio)]
	[Tooltip("Sets the Audio Clip played by the AudioSource component on a Game Object.")]
	public class SetAudioClip : FsmStateAction
	{
		[RequiredField]
		[CheckForComponent(typeof(AudioSource))]
		public FsmOwnerDefault gameObject;
		public AudioClip audioClip;

		public override void Reset()
		{
			gameObject = null;
			audioClip = null;
		}

		public override void OnEnter()
		{
			var go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go != null)
			{
				var audio = go.audio;
				if (audio != null)
				{
					audio.clip = audioClip;
				}
			}
			
			Finish();
		}
	}
}