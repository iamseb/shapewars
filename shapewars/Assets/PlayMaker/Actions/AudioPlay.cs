// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Audio)]
	[Tooltip("Plays the Audio Clip set with Set Audio Clip or in the Audio Source inspector on a Game Object.\nOptionally plays a one shot Audio Clip.")]
	public class AudioPlay : FsmStateAction
	{
		[RequiredField]
		[CheckForComponent(typeof(AudioSource))]
		public FsmOwnerDefault gameObject;
		[HasFloatSlider(0,1)]
		public FsmFloat volume;
		public AudioClip oneShotClip;
		public FsmEvent finishedEvent;

		AudioSource audio;
		
		public override void Reset()
		{
			gameObject = null;
			volume = 1f;
			oneShotClip = null;
		}

		public override void OnEnter()
		{
			var go = Fsm.GetOwnerDefaultTarget(gameObject);
			if (go != null)
			{
				// cache the AudioSource component
				
				audio = go.audio;
				if (audio != null)
				{
					if (oneShotClip == null)
					{
						audio.Play();
						
						if (!volume.IsNone)
							audio.volume = volume.Value;
						
						return;
					}
					else
					{
						if (!volume.IsNone)
							audio.PlayOneShot(oneShotClip, volume.Value);
						else
							audio.PlayOneShot(oneShotClip);
						
						return;
					}
				}
			}
			
			// Finish if failed to play sound
			
			Finish();
		}
		
		public override void OnUpdate ()
		{
			if (audio == null)
			{
				Finish();
			}
			else
			{
				if (!audio.isPlaying)
				{
					Fsm.Event(finishedEvent);
					Finish();
				}
			}
		}
	}
}