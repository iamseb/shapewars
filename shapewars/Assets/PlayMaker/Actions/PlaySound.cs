// (c) Copyright HutongGames, LLC 2010-2011. All rights reserved.

using UnityEngine;

namespace HutongGames.PlayMaker.Actions
{
	[ActionCategory(ActionCategory.Audio)]
	[Tooltip("Plays an Audio Clip at a position defined by a Game Object or Vector3. If a position is defined, it takes priority over the game object. This action doesn't require an Audio Source component, but offers less control than Audio actions.")]
	public class PlaySound : FsmStateAction
	{
		public FsmOwnerDefault gameObject;
		public FsmVector3 position;
		[RequiredField]
		public AudioClip clip;
		[HasFloatSlider(0, 1)]
		public FsmFloat volume = 1f;

		public override void Reset()
		{
			gameObject = null;
			position = new FsmVector3 { UseVariable = true };
			clip = null;
			volume = 1;
		}

		public override void OnEnter()
		{
			DoPlaySound();
			Finish();
		}


		void DoPlaySound()
		{
			if (clip == null)
			{
				LogWarning("Missing Audio Clip!");
				return;
			}

			if (!position.IsNone)
			{
				AudioSource.PlayClipAtPoint(clip, position.Value, volume.Value);
			}
			else
			{
				GameObject go = Fsm.GetOwnerDefaultTarget(gameObject);
				if (go == null) return;
	
				AudioSource.PlayClipAtPoint(clip, go.transform.position, volume.Value);
			}
		}


	}
}